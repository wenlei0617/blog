---
title: 学用Hook写React组件——通用弹出层
date: 2020-08-17 18:11:55
tags:
---

### 前言
> 最近升级项目，发现项目有很多各式各样的弹框，但是并没有对其进行抽象通用，根据项目迭代时间不同，实现方式也不统一，有使用ReactDOM.createPortal，也有使用ReactDOM.render，还有早期使用appendChild。秉承后期的可维护性和减少相同代码目的，开始对所有弹框进行分析。以下记录实现过程

### 实现方案分析
如上所述，主要的实现方式就createPortal、render、appendChild三种方式，appendChild无法直接监听销毁和创建过程，render的方式无法在内部读取到context，并且需要处理切换页面的销毁。最终选择createPortal的方式。

先创建一个Hook函数
```javascript
const usePortal = () => {
    
}
```

对于函数，先不用处理内部实现，先定义入参和出参，找到可变和不可变内容。入参及可变的变量（弹出层可变的变量），出参及我们需要的变量。分析了各种花式弹框后，得出可变部分为：
1. 弹出层内容
2. 是否能通过蒙层关闭弹出层
3. 蒙层样式
4. 渲染位置
5. 是否默认显示

转化为接口如下

```javascript
interface ProtalOptions {
    children: React.ReactNode,
    closeOnOutSide?: boolean,
    className?: string,
    rootContainer?: HTMLElement,
    defaultShow?: boolean
}
const useProtal = (options: ProtalOptions = {}) => {
    const { 
        closeOnOutSide,
        className,
        rootContainer,
        defaultShow,
        children
    } = options;
}
```

接下来需要对出参(函数返回值)进行分析，出参及使用函数者(场景下)需要的内容，根据自身业务场景进行分析。这里主要需要的内容是：
1. 创建弹出层
2. 弹出层状态
3. 弹出层关闭方法
4. 弹出层开启方法

```javascript
// ...略  同上
const useProtal = (options: ProtalOptions = {}) => {
    // 设定默认值
    const { 
        closeOnOutSide = true,
        className = '',
        rootContainer = document.body,
        defaultShow = false,
        children
    } = options;
    // 定义状态变量，并设置默认值
    const [isShow, setShow] = useState(defaultShow);
    
    // 创建弹出层
    const Protal = () => {}
    // 显示弹出层,很简单对setShow进行封装
    const handleShow = () => {
        setShow(true);
    }
    // 关闭弹出层
    const handleClose = () => {
        setShow(false);
    }
    
    return {
        Protal,
        isShow,
        handleShow,
        handleClose,
    }
}
```

大体的结构已经完成，现在只需要对每个函数进行具体的实现和对部分细节进行微调。前面讲到，我们需要通过createProtal进行创建弹出层，这里Protal函数即是对弹出层的UI实现（PS：这里个人对此有不同的见解，因为hook本身是抽离逻辑层，不应该牵扯到UI的实现，但这里需要使用Protal实现弹出层的最外层，是否应该把此抽离出来和hook组合使用。如果在hook里实现UI，如果处理了重复的渲染，而方便使用者，是否也可以不遵从上面的规则，个人在两种实现到现在也很纠结，恳请各路大神指点利弊），这里先采用了第二种实现，因为Protal为函数组件，这里把children属性移动到了Protal参数上，使用起来更为直观

```javascript
interface ProtalOptions {
    // children: React.ReactNode, 删除此定义
    closeOnOutSide?: boolean,
    className?: string,
    rootContainer?: HTMLElement,
    defaultShow?: boolean
}

const useProtal = (options: ProtalOptions = {}) => {
    // 设定默认值
    const { 
        closeOnOutSide = true,
        className = '',
        rootContainer = document.body,
        defaultShow = false,
        // children 删除此属性
    } = options;
    
    // ...略
    
    // 创建弹出层，避免函数的重复渲染，使用了useCallback
    const Protal = useCallback(({children}: {children: React.ReactNode}) => {
        if (!isShow) return null;
        
        return ReactDOM.createProtal(
            //这里定义了一个Wrap组件，作用是对蒙层的样式修改和对蒙层点击事件的控制
            <Wrap
                onClick={closeOnOutSide ? handleClose : () => {}}
                className={className}>
                {children}
            </Wrap>, rootContainer
        )
    }, [isShow]); // 这里对closeOnOutSide, rootContainer没有进行依赖，是希望这个两个值不能动态修改，减少不必要的渲染问题
    
    // ...略
}
```

Wrap组件的作用组要是对蒙层样式的定义和蒙层本身点击事件的控制与否，判断是否点击蒙层通过contains方法进行判断，具体实现如下：

```javascript
interface WrapProps {
    onClick: () => void,
    className?: string
}
// 判断当前点击是否为蒙层
const includeTarget = (target:HTMLElement, content: HTMLElement):boolean => {
    return target.contains(content);
}

const Wrap:React.FC<WrapProps> = ({children, onClick, className = ''}) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        const childNodes = (e.currentTarget as HTMLElement).childNodes;

        for (let i = 0; i < childNodes.length; i++) {
            if (!includeTarget(childNodes[i] as HTMLElement, e.target as HTMLElement)) {
                onClick && onClick();
            }
        }
    }, []);
    // styles.modal为默认样式，
    return (
        <div onClick={handleClick} className={`${styles.modal} ${className}`}>
            {children}
        </div>
    )
}
```

这里没有进行弹框动画封装，是因为本身页面每个弹框动画方式都会不同，封装动画会减少本身的扩展性。至于动画的实现可根据自己实际情况进行实现。

最终使用的方式，这里使用了react-spring库来实现动画的展示：

[源码地址](https://github.com/wenlei0617/react-use-portal.git)

```javascript
import React from 'react';
import useProtal from '@wenlei/react-use-portal';
import 'react-use-portal/dist/index.css';
import { animated, useSpring } from 'react-spring';

const App = () => {
    const { Protal, handleClose, handleShow, isShow } = useProtal();
    const animation = useSpring({
        reverse: !isShow,
        to: { opacity: 1 },
        from: { opacity: 0 },
    });

    return (
        <>
            <div>状态：{JSON.stringify(isShow)}</div>
            <button onClick={handleShow}>弹出</button>
            <Protal>
                <animated.div style={animation} className="popup">
                    <div>这是一个简单的弹框</div>
                    <button onClick={handleClose}>关闭</button>
                </animated.div>
            </Protal>
        </>
    )    
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5de937836cc49eea300dd207a20337c~tplv-k3u1fbpfcp-zoom-1.image)
