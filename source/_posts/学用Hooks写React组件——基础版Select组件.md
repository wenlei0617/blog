---
title: 学用Hooks写React组件——基础版Select组件
date: 2019-08-20 10:41:30
tags:
---

## 前言
> Select组件是我们在PC上常用组件，由于原生Select组件样式定制化困难，各个浏览器样式“百花齐放”， 不得不自己定制Select组件，已有很多很强大的UI库(antd, element)，Hooks是已经出来一段时间的新功能，抱着学习hooks的心态自己造轮子，本文会一步一步描述自己编写整个组件过程和思路。

## 思路构图与UI分层
#### 方案一：
通过一个父组件包裹显示框组件和下拉框组件，这样的实现方式简单粗暴，而且能解决大部分场景，但是存在几个问题：
1. 在scroll容器中会存在显示遮挡问题
2. 父组件容器层级较低时，高层级组件与下拉框组件位置重合问题

作为码农当然不能满足于此所以
#### 方案二：
通过React提供的**createPortal**来实现render body的方式渲染到body节点下，解决方案一的问题。

这里我们当然选择了render body的方案，整个组件思路是：点击显示组件，通过定位显示组件的位置来计算下拉框应该出现的位置。下拉框选中或者点击屏幕其他地方下拉框自动消失。选中后，显示对应的值。如果Select组件在带有滚动条的容器里，则监听容器的滚动来改变下拉框的位置。

> 是不是想准备开始撸起袖子干了呢，请稍等这里我们写代码之前先做了一个组件的拆分规划，便于我们提前预知一些问题。

这里我把组件拆分为：
* Select组件（显示选择结果）
* Menu组件（显示选择列表）
* Position组件（用于定位下拉框显示位置）

> 准备完毕，开始输出

#### Menu组件
* label 显示项的展示值
* value 显示项的设置值
* className

menu.css
```css
.ll-selected{
    background: #000;
    color: #fff;
}
```

Menu.jsx
```javascript
const SelectMenu = (props) => {
    const [ selected, setSelected ] = useState(false);
    const { label, value, className = '', handleSelect, defaultValue } = props;

    useEffect(() => {
        if (defaultValue === value) {
            setSelected(true);
        }
    }, [value, defaultValue])
    return (
        <div 
            onClick={() => handleSelect({value, label})} 
            className={`${className} ${selected ? 'll-selected': ''}`}>{label}</div>
    )
}
```
menu是Select组件最容易实现的，自己内部实现是否被选中。点击后向上传递选中的数据

#### Position组件
* targetRef 根据哪个组件位置进行定位
* getContainer 获取定位节点，默认render body
* onNotVisibleArea  组件不在可视区域内时会被调用

position.css
```css
.ll-position {
    position: absolute;
    z-index: 99;
    background: #fff;
}
```

Position.jsx
```javascript
let instance = null;

const Position = (props) => {
    const { targetRef, children, getContainer, onNotVisibleArea } = props;
    const container = getContainer && getContainer();
    
    if (!instance) {
        instance = document.createElement('div');
        instance.className = 'll-position';
        document.body.appendChild(instance);
    }

    useEffect(() => {

        function setInstanceStyle() {
            const { top, left, height } = targetRef.current.getBoundingClientRect();
            const style = {
                top: document.documentElement.scrollTop + top + height + 10 + 'px',
                left: document.documentElement.scrollLeft + left + 'px'
            }
    
            instance.style.top = style.top;
            instance.style.left = style.left;

            return { top, left, height }
        }

        setInstanceStyle();

        function handleScroll() {
            const { top, height } = setInstanceStyle();
            
            if (container.offsetTop > top) {
                onNotVisibleArea();
            }
            if (top - container.offsetTop + height > container.offsetHeight) {
                onNotVisibleArea();
            }
        }

        if (container) {
            container.addEventListener('scroll', handleScroll, false);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll, false);
            }
        }

    }, [targetRef])

    return instance && ReactDOM.createPortal(children, instance);
}
```
Position组件通过传入的targetRef来获取到需要定位dom的位置，instance没有销毁，是为了下次再点开就不需要重新创建根节点。这里使用了React.createProtal来创建root节点外的组件，参考：[https://zh-hans.reactjs.org/docs/portals.html]()。如果定位组件是在一个Scroll容器中，接收一个getContainer方法获取scroll容器，通过监听容器的scroll事件，来对定位组件进行移动，如果targetRef不在可视区域内了，调用onNotVisibleArea()方法，来通知上层组件。


#### Select组件
* defaultValue  默认选中的值
* onChange  当值被改变的时候调用的方法
* getContainer  获取菜单渲染的父节点，默认render body

Select.jsx
```javascript
const Select = (props) => {
    const { defaultValue, onChange, getContainer } = props;
    // 控制下拉框显示/隐藏
    const [visible, setVisible] = useState(false);
    // 当前选中的值
    const [data, setData] = useState({ value: defaultValue, label: '' });
    // 是否设置默认值
    const [defaultValueState, setDefaultValueState] = useState(true)
    const inputRef = useRef(null);

    // 查找defaultValue对应的label并展示出来
    useEffect(() => {
        if (!defaultValueState) return;
        const i = props.children.findIndex(n => n.props.value === defaultValue);
        if (i > -1) {
            setData(props.children[i].props);
            setDefaultValueState(true);
        }
    }, [defaultValue, props.children, defaultValueState])

    function handleSelect(data) {
        setData(data);
        onChange && onChange(data);
        setVisible(false);
    }

    function bindBodyClick(e) {
        if (e.target === inputRef.current) return;
        setVisible(false);
    }

    useEffect(() => {
        document.addEventListener('click', bindBodyClick, false);
        return () => {
            document.removeEventListener('click', bindBodyClick, false);
        }
    }, [visible])

    return (
        <React.Fragment>
            <input
                defaultValue={data.label}
                onClick={() => setVisible(true)}
                ref={inputRef}
                readOnly />
            {
                visible ?
                    <Position 
                        onNotVisibleArea={() => setVisible(false)}
                        getContainer={getContainer} 
                        targetRef={inputRef}>
                        {
                            React.Children.map(props.children, child => (
                                React.cloneElement(child, {
                                    defaultValue: data.value,
                                    handleSelect
                                })
                            ))
                        }
                    </Position> : null
            }
        </React.Fragment>
    )
}
```
以上的代码展示了一个简单的Select组件，通过visible来显示或者隐藏下拉框。

- input接收一个defaultValue来设置初始值，我们传入的初始值是对应的value而不是label，所以这里我是用循环props.children来查找对应的label，然后展示input的defaultValue。input点击则显示下拉框。

- Position组件是我们上面提到的定位组件，如果Position组件不在可视区时，执行noNotVisibleArea()方法让下拉框不显示。

- 使用React.cloneElement对props.children进行新的props传输，参考官网：[https://zh-hans.reactjs.org/docs/react-api.html#cloneelement]()。

- 监听document的click事件，来实现点击空白处下拉框消失。但是因为React的事件自己封装了一层并不是原生事件，这里涉及到了原生事件和合成事件的冒泡和捕获问题。参考官网：[https://zh-hans.reactjs.org/docs/events.html#___gatsby]()

> 最终使用呈现

```html
<div>
    <div style={{background: 'red', height: '200px'}}></div>
    <div id="area" style={{ margin: 10, overflow: 'scroll', height: 200 }}>
        <div style={{ padding: 100, height: 1000, background: '#eee' }}>
            <h4>滚动的区域</h4>
            <h4>滚动的区域</h4>
            <Select getContainer={() => document.getElementById('area')}>
                <SelectMenu label="第一" value="1"></SelectMenu>
                <SelectMenu label="第二" value="2"></SelectMenu>
                <SelectMenu label="第三" value="3"></SelectMenu>
                <SelectMenu label="第四" value="4"></SelectMenu>
            </Select>
        </div>
    </div>
    <Select>
        <SelectMenu label="第一" value="1"></SelectMenu>
        <SelectMenu label="第二" value="2"></SelectMenu>
        <SelectMenu label="第三" value="3"></SelectMenu>
        <SelectMenu label="第四" value="4"></SelectMenu>
    </Select>
</div>
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/20/16cadc8e8d733a6f~tplv-t2oaga2asx-image.image)

## 结尾
忽略了所有select不必要的样式和很多细节功能和优化，比如多选、禁止选中、搜索筛选、节流等等。自己去实现的时候遇到很多问题，然后去阅读别人的源码收获很多。水平有限，如果错误请大家指出，谢谢。