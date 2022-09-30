---
title: 关于React的Key导致的bug总结
date: 2021-07-01 18:17:33
tags:
---

> 故事要从项目中做一个可编辑表格组件，表格使用了一个二维数组作为基础数据。类似[[1，2，3],[4，5，6]]，外层坐标代表行，内层坐标代表列数。

因为本身数据没有类似id的唯一值，这里便不假思索的启用了索性作为key，渲染也就完成了，顺便也加上了添加和删除功能，一切都是那么顺利。因为需要编辑，这里及把最初的展示组件替换成了input组件，这里并没有使用受控组件，而使用非受控组件，监听blur后再进行数据更新上传至服务器，所以input只设置了defaultvalue值，然后测试，发现删除怎么也删不了第一行。如图所示：

![20210630_121708.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/243bcee7ebff46afb332ce59d8113566~tplv-k3u1fbpfcp-watermark.image)

代码如下：
```jsx
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';

const getMock = () => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push([
      `${result.length}-${i}`,
      `${result.length}-${i + 1}`,
      `${result.length}-${i + 2}`
    ]);
  }
  return result;
}

const Cell = ({
  onBlur,
  value
}) => {
  return (
    <div className="cell">
      <input
        onBlur={(e) => onBlur(e.target.value)}
        defaultValue={value}
      />
    </div>
  );
};

const Row = ({
  onRemove,
  children
}) => {
  return (
    <div className="flex">
      {children}
      <button onClick={onRemove}>删除</button>
    </div>
  );
};

const TableV2 = () => {
  const [dataSource, setData] = useImmer(getMock());

  const handleRemove = useCallback((rowIndex) => {
    setData((data) => {
      data.splice(rowIndex, 1);
    });
  }, []);

  const handleBlur = useCallback((value, rowIndex, colIndex) => {
    setData((data) => {
      data[rowIndex][colIndex] = value;
    });
  }, []);

  return (
    <div>
      {
        dataSource.map((data, rowIndex) => (
          <Row key={rowIndex} onRemove={() => handleRemove(rowIndex)}>
            {
              data.map((cell, colIndex) => (
                <Cell
                  onBlur={(value) => handleBlur(value, rowIndex, colIndex)}
                  value={cell}
                  key={colIndex}
                />
              ))
            }
          </Row>
        ))
      }
    </div>
  )
};

```

为什么会出现如此情况呢？其实是因为使用了数组索引作为key的原因导致（eslint规则可以对此做验证来避免问题的发生），这里就不得不提react的diff算法，为什么会导致这一奇怪的"bug"呢？这里这里为了找寻问题，我们尝试把input替换成了span标签，结果操作又不会发生上述情况了，是否很疑惑刚刚说是因为key原因导致，但是修改为展示组件却没问题，而使用input就不行呢？这就不得不需要详细了解react diff算法内部如何对组件进行对比、更新、销毁组件。

### 为什么有diff算法
在了解react diff算法之前，我们先了解一下为什么前端框架都在用diff算法。在远古时代，页面中内容如果需要变化，需要服务器重新生成新的html，然后全量重新渲染，这个时候前端没有复杂的交互仅仅文字和图片，全量更新变成了最快捷的方式。

然后来到ajax时代，前端独立交互初现，这个时候我们更改页面中的某个值时我们使用jquery获取到要修改的dom然后进行修改、删除、移动，如果现在再来看，这些操作可以比喻成我们自己手动进行了diff算法，找到了最优解然后进行dom操作。

直到现在，前端不再是简单的页面仔了，前端业务开始复杂，微前端，可视化，nocode等等业务问世，前端数据交互也是越来越复杂，一个新手很难再用jquery来开发和维护如此庞大的业务，三大框架应运而生，数据驱动视图概念出世，为了解决过去每次修改UI数据都要去进行dom操作，框架就在上层封装了一层虚拟dom层，dom的修改全都交付给框架完成，使用者几乎不再需要操作dom去更新视图。而框架则需要使用高效快捷的方法在虚拟dom中做对比，diff算法随之而来。

### diff算法是什么
传统diff算法是寻找一个树转化为另一个树的最小操作的算法，通过循环递归进行依次对比，算法复杂度O(n^3)。也就是说1000个节点的树，需要十亿次的步骤才能完成树的转换，而这种效率明显无法适用于实际场景。所以react则在diff算法上做了改进，使之达到O(n)。

### react的diff算法
react为了优化算法，在传统diff算法上加入了两个限制：

**1. 两个不同类型的元素会产生出不同的树；**

当根节点为不同类型时，react会直接销毁组件，并重新创建一个新的组件插入树中，且不会再递归它的子节点，一刀切，全部销毁。官网示例：
        
```html
// 修改前
<div>
  <Counter />
</div>

// 修改后
<span>
  <Counter />
</span>
```
上述代码因为div标签修改成了span标签，react会判断当前节点类型不同，所以会整个组件重新创建，而Counter组件是其子组件及时它并没有发生任何变化，也随之销毁，再重新走创建挂载的生命周期。

如果进行对比时，类型是同一类型，则react不会对组件进行销毁，而且检查需要更新的属性，进行update操作。示例：
```html
// 修改前
<Counter count={1}/>

// 修改后 counter不会被卸载，而是执行更新操作
<Counter count={2}/>
```

**2. 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定**

当节点绑定唯一key时，是为了告知react以此作为唯一标识,如果key相同并且类型相同，则react会复用组件，而不会对组件进行销毁，官网示例：
```html
// 修改前
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

// 修改后 添加了一条记录
<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```
现在 React 知道只有带着 '2014' key 的元素是新元素，带着 '2015' 以及 '2016' key 的元素仅仅移动了。
先对比key再对比type，如何都相同则表示可复用，如果不相同则销毁重新创建。这便是我们最开始demo的问题所在，我们使用了index作为key，在删除第一个组件时，第二个组件的key被修改为0，此时因为type相同并且key相同，react默认复用了第一个组件，并没有把第一个组件进行销毁，在更新时只是发现props defaultValue发生了变化，所以只是对组件进行了更新，而input defaultValue更新并不能修改value的值，所以导致了我们最开始发生的无法删除问题。

### 如何解决这个问题
既然我们现在知道原因，我们应该如何处理这个问题呢？
1. 我们可以把非受控组件改为受控组件，但是在做删除时会引发全量更新。
2. 给每个list添加一个唯一id，这样就完成了我们最基础的功能。
修改后代码：
```jsx
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { v1 } from 'uuid';

const getMock = () => {
  const result = [];
  for (let i=0; i<3; i++) {
    result.push({
      rowId: `row${i}`,
      value: new Array(3).fill(undefined).map((n, x) => ({
        colId: `col${i}${x}`,
        value: n
      }))
    });
  }
  return result;
}

const Cell = ({
  onBlur,
  value
}) => {
  return (
    <div className="cell">
      <input
        onBlur={(e) => onBlur(e.target.value)}
        defaultValue={value}
      />
    </div>
  );
};

const Row = ({
  onRemove,
  children
}) => {
  return (
    <div className="flex">
      {children}
      <button onClick={onRemove}>删除</button>
    </div>
  );
};

const TableV3 = () => {
  const [dataSource, setData] = useImmer(getMock());

  const handleRemove = useCallback((rowId) => {
    setData((data) => {
      const index = data.findIndex((d) => d.rowId === rowId);
      data.splice(index, 1);
    });
  }, []);

  const handleBlur = useCallback((value, rowId, colId) => {
    setData((data) => {
      const rowIndex = data.findIndex((d) => d.rowId === rowId);
      const colIndex = data[rowIndex].value.findIndex((c) => c.colId === colId);
      data[rowIndex][colIndex] = value;
    });
  }, []);

  return (
    <div>
      {
        dataSource.map((data) => (
          <Row key={data.rowId} onRemove={() => handleRemove(data.rowId)}>
            {
              data.value.map((cell) => (
                <Cell
                  onBlur={(value) => handleBlur(value, data.rowId, data.colId)}
                  value={cell.value}
                  key={cell.colId}
                />
              ))
            }
          </Row>
        ))
      }
    </div>
  )
};
```

测试时发现，当渲染一个10000万cell的表格时，每次修改数据后会产生不顺畅，是因为修改数据后没有做优化导致所有的Row、Cell都重新render。而我们希望每次只修改了一个cell，就是只重新渲染修改的cell，虽然现在我们使用了uuid做为Key使得组件得以复用，但是因为没有对props进行对比导致组件重新渲染。这里我们可以通过React.memo对Row和Cell组件进行优化。

### 延伸
上面我们说到key的作用，在实际项目中我们常用于列表渲染才使用key，既然我们了解到key可以作为react的标识，也就是可以通过key来做一些优化。我们有时候会遇到类似这类需求，用户通过一个按钮切换使某个组件置顶，类似代码:

```jsx
import React, { useEffect, useState } from 'react';

const Test1 = () => {
  useEffect(() => {
    console.log('test1 挂载');
    return () => {
      console.log('test1 卸载');
    };
  }, []);
  console.log('test1 render');
  return (
    <div>test1</div>
  );
};

const Test2 = () => {
  useEffect(() => {
    console.log('test2 挂载');
    return () => {
      console.log('test2 卸载');
    };
  }, []);
  console.log('test2 render');
  return (
    <div>test2</div>
  );
};

const VisibleTest = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <button onClick={() => setVisible(!visible)}>
        {!visible ? 'Test1顶置' : 'Test1置顶'}
      </button>
      <div>
        {
          visible ? (
            <React.Fragment>
              <Test1 />
              <Test2 />
            </React.Fragment>
          ) : (
              <React.Fragment>
                <Test2 />
                <Test1 />
              </React.Fragment>
            )
        }
      </div>
    </div>
  )
};
```

我们会通过visible控制Test1组件和Test2组件的位置，这时候在切换visible为false时，各个组件的生命周期执行过程

- Test1
    - 初始化： render-挂载
    - visible改变：render-卸载-挂载

- Test2
    - render-挂载
    - visible改变：render-卸载-挂载

上述可以看出我们仅仅是改变了组件的位置，缺导致了两个组件都被卸载并且重新挂载了，这个时候我们为Test1组件和Test2组件分别添加一个key

```jsx
{
  visible ? (
    <React.Fragment>
      <Test1 key="1"/>
      <Test2 key="2"/>
    </React.Fragment>
  ) : (
      <React.Fragment>
        <Test2 key="2"/>
        <Test1 key="1"/>
      </React.Fragment>
    )
}
```

然后再重新执行上述操作，打印出各个组件的生命周期执行过程

- Test1
    - 初始化：render-挂载
    - visible改变：render
- Test2
    - 初始化：render-挂载
    - visible改变：render

测试后发现Test1和Test2组件并没有重新卸载，而是被react复用了。利用这种方式在某些场景能有效提高页面性能，避免组件的卸载。

### 最后
> 现在我们简单了解了react组件更新销毁机制，这样我们就可以在平时业务中进行更多的性能优化和bug感知。如果觉得有用？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！觉得没用？评论区交流您的想法，虚心接受您的指导。