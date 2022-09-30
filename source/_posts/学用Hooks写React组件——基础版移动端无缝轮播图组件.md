---
title: 学用Hooks写React组件——基础版移动端无缝轮播图组件
date: 2019-12-02 18:11:06
tags:
---

## 前言
> 最近忙于写业务代码和修改上古MPA的JS页面，对React欠缺使用和学习，感觉自己都快写不来代码了。拿来主义思想占据了思维，所以还是要造造轮子。因为最近在做移动端的东西，所以尝试写一个移动端的无缝轮播图，当前版本只支持手势切换和点击切换功能。文章主要包括从简单雏形到最终效果所有的思路和代码。

## 简单效果图
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/30/16ebcf1383d8a873~tplv-t2oaga2asx-image.image)
## 设计思路
问：无缝轮播需要解决的问题在于，切换到最后一个轮播图时，如何<font color="red"><b>流畅</b></font>的到达第一个？

<b>答：核心思想是利用视觉上的感觉，在用户无感的情况下切换回去，也就是快速回滚。为了达成这个目的，就是在最后一个轮播图的后面加上第一个轮播图，当从最后一个切换到第一个时，先切换到备用的第一个，然后快速回滚到真正的第一个轮播图。第一个同理，可能有点绕，可以看图理解：</b>

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/1/16ebd1c06fc260a4~tplv-t2oaga2asx-image.image)
布局思路就是这样，这样布局也就是需要多增加一个轮播子组件，如果子组件的布局复杂(类似卡片或者其他复杂组件)，就有点浪费资源，为了减少不必要dom的渲染，可以使用类似摩天轮的方式，循环补位，本质上思路不变，只是当在最后一个轮播图时，把第一个轮播图移动到它的后面，然后瞬间把第一个轮播图又移动到第一个位置。第一个轮播图同理。文字描述不好理解，还是看图说话吧：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/1/16ebd1c5ee50ed27~tplv-t2oaga2asx-image.image)
## 实现
#### 布局
先创建一个外层包裹容器，也就是可视区容器，然后使用一个包裹容器把所有的轮播子组件进行包裹，之后轮播图的滚动都是控制包裹容器的位置来进行切换的。轮播图子组件需要位置可移动所以都使用绝对定位。点击按钮单独呈现，代码如下：
```html
/* 可视区容器 */
<div>
    /* 包裹容器 */
    <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
    /* 按钮容器 */
    <div>
        <button>Left</button>
        <button>Right</button>
    </div>
</div>
```
#### 核心功能
其实轮播图核心功能就是切换。只是切换的方式不同，比如点击切换、手势切换、自动切换，所以我们先从基础的切换入手。
```js
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.css';

const Carousel = ({children, selectedIndex = 1}) => {
    // 当切换的时候，改变的就是当前位置状态
    // 所以定义当前位置,可以通过传入的selectedIndex来控制最开始显示第几个轮播图,默认从1开始
    const [active, setActive] = useState(selectedIndex);
    // 获取包裹容器
    const container = useRef(null);
    // 获取当前可视区容器宽度
    const SCREEN_WIDTH = window.screen.width;
    
    // 统一处理，当active发生变化的时候，我们需要做的就是切换轮播图到某个位置,转场通过控制包裹容器的transform来进行切换，对transform的控制封装成setTransition函数
    useEffect(() => {
        setTransition();
    }, [active]);
    
    const setTransition = () => {
        // 计算需要移动的距离并进行修改，这是切换的核心
        const distance = (1 - active) * SCREEN_WIDTH;
        container.current.style.transform = `translate3d(${distance}px, 0, 0)`;
    }
    
    // 为了演示是否成功，添加两个按钮来切换
    // 上一页
    const handlePrev = () => {
        // 对临界值进行处理
        setActive(active === 1 ? children.length : active - 1)
    }
    
    // 下一页
    const handleNext = () => {
        // 对临界值进行处理
        setActive(active === children.length ? 1 : active + 1);
    }
    
    return (
        <div className={style.carousel}>
            <div 
                ref={container}
                className={styles.container}>
                {
                    React.Children.map(children, (child, index) => {
                        return (
                            <div 
                                style={{left: index * SCREEN_WIDTH}}
                                className={styles.items}>{child}</div>
                        )
                    })
                }
            </div>
            <div>
                <div onClick={handlePrev} className={styles.buttonLeft}>Left</div>
                <div onClick={handleNext} className={styles.buttonRight}>Right</div>
            </div>
        </div>
    )
}
```
附css代码
```css
.carousel{
    width: 100%;
    overflow: hidden;
    position: relative;
}
.container{
    transform: translate3d(0,0,0);
    transition-duration: 1s;
    transition-property: all;
    transition-timing-function: ease;
    position: relative;
    height: 100px;
}
.items {
    width: 100%;
    flex-shrink: 0;
    position: absolute;
    top: 0;
}
.buttonLeft {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    background: #fff;
}
.buttonRight {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height: 30px;
    background: #fff;
}
```
效果如图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/30/16ebd034c69775c4~tplv-t2oaga2asx-image.image)
这样就完成了基本的切换了。但是还没有实现无缝切换，最后一个切换到第一个的时候我们还没有用上面的思路进行处理。现在开始处理无缝的问题,主要处理如何循环补位能达到瞬间转换的效果，我这里是使用container.current.style.transitionProperty = 'none'关闭动画来进行瞬间切换。
```js
const Carousel = ({children, selectedIndex = 1}) => {
    // 创建一个参数，对轮播图的状态进行控制  1为静止，2为进行中。主要目的是避免快速切换导致的bug。
    // 所以只有在动画结束过后，也就是静止的时候才能再次切换轮播图
    const [status, setStatus] = useState(1);
    ...
    ...相同代码省略
    ...
    
    // 因为要达到流畅的切换，已当前为第一个轮播图为例，向左切换时，最后一个轮播图补位，然后瞬间归位(在此时取消过渡动画，完成流畅切换); 对setTransition进行修改并新增offset参数对函数进行增强，后面具体会讲到此参数的作用。
    const setTransition = (offset = 0) => {
        ...新增的代码
        function transitionend() {
            // 动画结束后就关闭动画
            container.current.style.transitionProperty = 'none';
            // 恢复状态为1静止
            setStatus(1);
            // 当前位置在补位的位置时马上切换到本该在的位置
            if (active === 0) {
                // 使用setTimeout包裹，避免transitionProperty动画未关闭就切换的闪频
                setTimeout(() => {
                    setActive(children.length);
                }, 0)
            }
            if (active === children.length + 1) {
                setTimeout(() => {
                    setActive(1);
                }, 0)
            }
            container.current.removeEventListener('transitionend', transitionend, false);
        }
        container.current.addEventListener('transitionend', transitionend, false);
        
        const distance = (1 - active) * SCREEN_WIDTH;
        ...修改的代码，新增offset
        container.current.style.transform = `translate3d(${distance+offset}px,0,0)`;
        }
    }
    
    ...新增代码，封装对active修改的操作
    const handleChangeActive = (number) => {
        // 当在动画进行时，不允许切换
        if (status === 2) return;
        // 切换前先把动画参数打开
        container.current.style.transitionProperty = 'all';
        // 修改状态为进行时
        setStatus(2);
        // 改变当前位置
        setActive(number);
    }
    
    ...修改的代码
    const handlePrev = () => {
        // 根据之前的理论，当前位置如果是第一个的情况下，最后一个轮播图会跳到第一个的前面
        // 切换到前面的时候active就要减去到0才能到达位置，所以对此进行修改，并使用前面封装的handleChangeActive方法进行包裹
        // 之前的代码
        // setActive(active === 1 ? children.length : active - 1)；
        // 修改过后的代码
        handleChangeActive(active === 0 ? children.length : active - 1);
    }
    
    const handleNext = () => {
        // 此处同上同理
        // 之前的代码
        // setActive(active === children.length ? 1 : active + 1);
        handleChangeActive(active === children.length + 1 ? 1 : active + 1);
    }
    
    return (
        <div className={styles.carousel}>
            <div
                ref={container}
                className={styles.container}>
                {
                    React.Children.map(children, (child, index) => {
                        ...修改的代码
                        // 当轮播图处于第一个时，最后一个组件时，提取到最前面去
                        if (active <= 1 && index + 1 === children.length) {
                            return (
                                <div style={{left: -1 * SCREEN_WIDTH}} className={styles.items}>{child}</div>
                            )
                        }
                        // 当轮播图处于最后一个时，第一个组件提取到最后面
                        if (active >= children.length && index === 0) {
                            return (
                                <div style={{left: children.length * SCREEN_WIDTH}} className={styles.item}>{child}</div>
                            )
                        }
                        return (
                            <div 
                                style={{left: index * SCREEN_WIDTH}}
                                className={styles.items}>{child}</div>
                        )
                    })
                }    
            </div>
        </div>
    )
}
```

到这里无缝轮播就算大功告成。之后就是对轮播图进行扩展了。不管怎么切换，使用核心的两个函数就可以解决大部分功能需求(setTransition、handleChangeActive)。现在我们再对此进行增加，加入手势的滑动,这里我引入了第三方库hammerjs来作为手势的处理
```js
...相同代码省略
import Hammer from 'hammerjs';
...
...相同代码省略
...
useEffect(() => {
    cosnt manager = new Hammer(container.current);
    manager.add(new Hammer.Pan());
    manager.on('panend panmove', function(e) {
        // 状态在进行中时，不允许切换
        if (status === 2) return;
        // e.eventType 判断当前状态  
        // INPUT_MOVE 移动中  
        // INPUT_END 结束
        if (e.eventType === Hammer.INPUT_MOVE) {
            // 之前的offset参数的在此起到了作用，在手动滑动的时候并不是直接滑动到下一页，只是跟随手指进行偏移量改变
            setTransition(e.deltaX);
        } else if (e.eventType === Hammer.INPUT_END) {
            // e.direction 判断移动方向
            // Hammer.DIRECTION_LEFT 向左
            // Hammer.DIRECTION_RIGHT 向右
            // 当滑动距离大于1/3时，直接滑动到下一页，否则恢复偏移量
            if (e.direction === Hammer.DIRECTION_LEFT && Math.abs(e.deltaX) > SCREEN_WIDTH / 3) {
                handleNext();
            } else if (e.direction === Hammer.DIRECTION_RIGHT && Math.abs(e.deltaX) > SCREEN_WIDTH / 3) {
                handlePrev();
            } else {
                setTransition(0);
            }
        }
        return () => {
            manager.off('panmove');
            manager.off('panend');
        }
    })
    
}, [status, active])

```
手势切换也加上了。其它方式的切换道理也是一样的。

## 总结
到这里，一个简易版的移动端手势滚动组件就完成了，里面还有很多的不足、功能缺陷和优化点，例如容器宽度和高度的判断，宽度直接取得手机宽度，高度我直接写死的；轮播子组件的懒加载等等，之后也会慢慢进行增强和优化。毕竟路漫漫其修远兮。如果这篇文章的思路能对你有所帮助，不妨点个喜欢。