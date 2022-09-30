---
title: 逐步拆解React组件—Lazyload懒加载
date: 2021-02-19 18:13:09
tags:
---

> 知其然，必知其所以然。在充满各种轮子的世界，即使我们没有必要自己造轮子，但是也要懂得轮子的原理，才能把别人的变成自己的。

### 为什么要用懒加载

在平时开发的时候我们总会遇到长列表，因为本身web在长列表的性能并不是特别好；加之web本身受到网络波动影响特别大，在首屏同时加载过多的内容会导致卡顿不流畅响应速度慢等问题。对此我们常用懒加载机制来进行优化。

### 什么是懒加载

懒加载也叫延迟加载，指的是在长网页中延迟加载dom(jquery时期常用于延迟加载图片，现在也会用于延迟加载复杂组件)，是优化网页性能的方式之一。当dom不在可视区内时，dom使用占位符展示，当到达可视区后再进行真实dom加载渲染。

### 怎么实现懒加载
随着浏览器的功能越来越强大，现如今有两种方式实现懒加载；

1. 使用监听scroll事件进行监听
    - 优点：兼容性好；
    - 缺点：实现复杂；计算量大性能差；
2. 使用IntersectionObserver方式进行监听
    - 优点：实现简单；性能高；
    - 缺点：兼容性不够好([可以使用polyfill处理](https://github.com/w3c/IntersectionObserver))；API是异步的，不随着目标元素的滚动同步触发。规格写明，IntersectionObserver的实现，应该采用requestIdleCallback()，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。

这里我采用了scroll方式进行实现，理由是：因为IntersectionObserver是异步的，在设计时考虑到要处理防抖节流问题，使用scroll更容易实现。**核心思路及是通过事件监听然后执行检测元素是否可见的方法最后执行任务**。这里提到了防抖和节流，在长列表中用户快速滑动时，视图直接划过用户并没有查看，使用防抖和节流可以有效的改善性能，这里简单解释一下防抖和节流的区别
- 防抖：在规定时间内多次触发时只执行最后一次
- 节流：在规定时间内多次触发时只执行某几次

防抖和节流都是为了限制函数的执行频率，以优化函数触发频率过高导致的响应速度跟不上，延迟假死或卡顿的现象

防抖函数:原理是维护一个计时器,在规定时间后执行回调.若在此期间再次触发,则重新开始计时
```typescript
function debounceFunc(fn: any, wait: number) {
    let timer:any = null;
    return function () {
        let args = arguments;

        timer && clearTimeout(timer);

        timer = setTimeout(() => {
            //@ts-ignore
            fn.apply(this, args)
        }, wait);
    }
}
```
节流函数:原理是判断是否达到规定时间，到达时则执行回调
```typescript
function throttleFunc(fn: any, wait: number) {
    let time = 0, timer:any = null;
    return function () {
        let now = Date.now();
        let args = arguments;
        if (now - time > wait) {
            //@ts-ignore
            fn.apply(this, args);
            time = now;
        } else {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                //@ts-ignore
                fn.apply(this, args);
                time = now;
            }, wait);
        }
    }
}
```
### 核心内容
上面讲到懒加载核心在于检测元素是否可见，检测元素是否可见及判断dom是位置是否在可视区内，主要通过top, left来判断，我们可以使用getBoundingClientRect方法来获取dom的具体信息。这里先尝试使用js来实现一个checkVisible函数。
```typescript
// 定义一个函数，参数为要检查的dom和滚动容器dom。返回boolean
const checkVisible = (dom: HTMLElement, parentDom: HTMLElement): boolean => {
    // 获取dom的信息
    const { top, left, width, height } = dom.getBoundingClientRect();
    const {
        top: parentTop,
        left: parentLeft,
        width: parentWidth,
        height: parentHeight
    } = parentDom.getBoundingClientRect();
    // 获取屏幕的宽高
    const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowInnerWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const intersectionTop = Math.min(parentTop, 0);
    const intersectionLeft = Math.min(parentLeft, 0);
    // 计算可视区高度和宽度，因为parentDom可能比屏幕大，这里最大取window得宽高
    const intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop;
    const intersectionWidth = Math.min(windowInnerWidth, parentLeft + parentWidth) - intersectionLeft;
    // 计算要检查的dom距离parentDom的距离
    const offsetTop = top - intersectionTop;
    const offsetLeft = left - intersectionLeft;
    // 进行比较
    return (
        offsetTop <= intersectionHeight &&
        offsetTop + height >= 0 &&
        offsetLeft <= intersectionWidth &&
        offsetLeft + width >= 0
    )
}
```

完成了核心的函数后，这里我们开始把转化成react的方式

### API设计

参数|说明|类型|默认值
-|-|-|-
children|必选，懒加载组件|React.ReactNode|-
loading|必选，占位组件|React.ReactNode|-
scrollContainer|可选，滚动容器|string/dom|document.body
offset|可选，偏移量|number/Array(number)|0
resize|可选，是否监听resize事件|boolean|false
debounce|可选，防抖时间，优先级高于节流|number|0
throttle|可选，节流时间，优先级低于防抖|number|0

### 源码解析

```typescript
import React, { useState, useRef, useEffect } from 'react';
// 定义组件Props
interface LazyloadProps {    
    loading: React.ReactNode;
    scrollContainer?: HTMLElement;
    offset?: number;
    resize?: boolean;
    debounce?: number;
    throttle?: number;
}
// 需要监听的事件
const DEFAULT_EVENTS = [
    'scroll',
    'wheel',
    'mousewheel',
    'animationend',
    'transitionend',
    'touchmove',
];

const Lazyload: React.FC<LazyloadProps> = (props) => {
    // 设置Props默认值
    const {
        children,
        loading,
        scrollContainer = document.body,
        offset = 0,
        debounce = 0,
        throttle = 0,
        resize = false
    } = props;
    // 是否可见
    const [isVisible, setVisible] = useState(false);
    // 包裹容器
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
    	// 检查函数
        let checkVisible = () => {
            // 如果容器不存在则不计算
            if (!containerRef.current) return;
            // 获取当前组件位置
            const { top, left, width, height } = containerRef.current?.getBoundingClientRect();
            // 获取滚动容器位置
            const {
                top: parentTop,
                left: parentLeft,
                width: parentWidth,
                height: parentHeight
            } = scrollContainer.getBoundingClientRect();
            // 计算屏幕高度和宽度
            const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowInnerWidth = window.innerWidth || document.documentElement.clientWidth;
            // 计算滚动容器和屏幕可视区的相交区域
            const intersectionTop = Math.min(parentTop, 0);
            const intersectionLeft = Math.min(parentLeft, 0);

            const intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop;
            const intersectionWidth = Math.min(windowInnerWidth, parentLeft + parentWidth) - intersectionLeft;
            // 计算组件距离可视区的高度
            const offsetTop = top - intersectionTop;
            const offsetLeft = left - intersectionLeft;
            // 偏移量计算[top, left]
            const offsets = Array.isArray(offset) ? offset : [offset, offset];
            // 通过上述距离判断组件是否在可见区域
            const isVisible = offsetTop - offsets[0] <= intersectionHeight &&
            offsetTop + height + offsets[0] >= 0 &&
            offsetLeft - offsets[1] <= intersectionWidth &&
            offsetLeft + width + offsets[1] >= 0;

            setVisible(isVisible);
            // 如果可见取消当前组件的所有的监听
            if (isVisible) {
                DEFAULT_EVENTS.forEach((event) => {
                    scrollContainer?.removeEventListener(event, checkVisible);
                });
                window.removeEventListener('resize', checkVisible);
            }
        }
        // 使用防抖节流增强checkVisbile函数，这里优先防抖，其次节流
        if (debounce) {
            // 防抖函数
            checkVisible = debounceFunc(checkVisible, debounce);
        } else if (throttle) {
            // 节流函数
            checkVisible = throttleFunc(checkVisible, throttle);
        }
        // 批量监听事件
        DEFAULT_EVENTS.forEach((event) => {
            scrollContainer?.addEventListener(event, checkVisible);
        });
		
        if (resize) {
            window.addEventListener('resize', checkVisible);
        }
        // 自动执行一次
        checkVisible();

        return () => {
            DEFAULT_EVENTS.forEach((event) => {
                scrollContainer?.removeEventListener(event, checkVisible);
            })
            window.removeEventListener('resize', checkVisible);
        }
    }, [scrollContainer, containerRef.current])
    
    return (
        <div ref={containerRef}>
            { isVisible ? children : loading }
        </div>
    )
}

```

### 如何使用
> npm install @lumu/lazyload --save

```typescript
import React from 'react';
import Lazyload from '@lumu/lazyload';

const Loading = () => {
    return (
        <img
            className="test"
            alt=""
            src={require('./loading.gif')} />
    )
}

const App = () => {
    return (
        <React.Fragment>
            {
                new Array(10).fill(1).map((_, index) => (
                    <Lazyload
                        resize
                        scrollContainer={document.getElementById('root') as HTMLDivElement}
                        debounce={300}
                        offset={50}
                        loading={<Loading/>}
                        key={index}>
                        <img alt="" src="https://img01.yzcdn.cn/vant/apple-1.jpg" width="100%" height="300"/>    
                    </Lazyload>
                ))
            }
        </React.Fragment>
    )
}
```

[源码地址](https://github.com/wenlei0617/lumu-lazyload)

[示例演示](http://49.235.254.79/lumu-lazyload)

### 往期回顾
- [逐步拆解React组件--Swipe轮播图](https://juejin.cn/post/6925239227999322119)

### 最后

> 觉得有用？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！觉得没用？评论区交流您的想法，虚心接受您的指导。
