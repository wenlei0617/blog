---
title: 逐步拆解React组件—Swipe轮播图
date: 2021-02-14 18:12:22
tags:
---

> 以前有写过一篇[简版的swipe轮播组件](https://juejin.cn/post/6844904008646131725)，当时并没有考虑很多细节和通用参数配置，主要还是在于记录实现思路，也就没有源码，赶在年前重新拾起来好好的整理了一番，并封装成了组件，除react本身外无任何第三方依赖，gzip压缩后大小仅3.7kb，[源码地址](https://github.com/wenlei0617/lumu-swipe)、[示例地址](http://49.235.254.79/lumu-swipe/)

### 思路回顾
<b>核心思想是利用视觉上的感觉，在用户无感的情况下切换回去，这里有一个思路和以前有点不同，切换回去这个动作改在了切换的时候进行复位重置并且弃用用了之前的absolute布局，改用了flex布局的方式，移动主要还是依靠通过改变外层容器transform来实现,无缝轮播的思路步骤如下</b>

1. 当前位置在如图，位置3上，红色箭头即手机可视区。
2. 往右移动前，把位置1通过transform移动到位置3后面
3. 然后再移动外层容器，完成第一次的无缝
4. 再往右移动前，先重置位置1到原始位置(快速移动)
5. 并把外层容器移动到位置1处到达可视区(快速移动)
6. 再进行右移动，完成第二次的无缝。左移同理

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3c01c48663349559716462bd83ece24~tplv-k3u1fbpfcp-watermark.image)

设计思路了解后，就开始对组件API和方法的设计，文档如下

#### API
|参数|说明|类型|默认值|
-|-|-|-
autoplay|可选，自动轮播间隔，单位ms|number|3000
duration|可选，动画时长,单位ms|number|500
initialSwipe|可选，默认位置|number|0
loop|可选，是否循环播放|boolean|true
vertical|可选，是否纵向滑动|boolean|false
touchable|可选，是否可手势滑动|boolean|true
showIndicators|可选，是否显示dot|boolean|true
style|可选，容器样式, 纵向时需要设置其高度|object|-
onSlideChange|可选，切换索引的回调|function(current)|-

#### 方法
|名称|描述|
-|-
slideTo(to, swiping)|切换到指定索引，swiping = true时，不使用动画
next()|切换到下一个索引
prev()|切换到上一个索引

准备就绪，愉快的开始针对文档进行代码实现吧！！

### 第一步，布局页面
这里通过把组件拆分为Swipe和SwipeItem两个组件，Swipe为主要容器，SwipeItem为子项，Swipe验证children是否为SwipeItem组件，布局上采用了flex布局，本身flexDirection可以进行横向和竖向的展示，以便于后期通过vertical属性进行横向和纵向的布局切换。轮播移动主要依靠改变外层容器的transfrom属性进行偏移，布局核心在于动态计算SwipeItem的宽度和移动容器的宽度(SwipeItem的宽度 * SwipeItem的个数)。
```typescript
// Swipe.tsx
import React from 'react';
import SwipeItem from './SwipeItem';
import './style.less';

const Swipe:React.FC<SwipeProps> = (props) => {
    const {
        initialSwipe = 0, // 默认索引
        vertical = false, // 是否纵向
        duration = 500,   // 切换动画时间
        autoplay = 3000,  // 自动播放间隔
        touchable = true, // 是否支持手势滑动
        loop = true,      // 是否无缝轮播
        showIndicators = true, // 是否显示dots
        onSlideChange
    } = props;
    
    // 计算SwipeItem个数
    const count = useMemo(() => React.Children.count(props.children), [props.children]);
    // 获取容器的宽度和高度
    const { size, root } = useRect<HTMLDivElement>([count]);
    // 获取SwipeItem的高度/宽度的值
    const itemSize = useMemo(() => vertical ? size.height : size.width, [size, vertical]);
    // 获取SwipeItem应该设置高度还是宽度
    const itemKey = useMemo(() => vertical ? 'height' : 'width', [vertical]);
    // 设置SwipeItem的样式
    const itemStyle = useMemo(() => ({ [itemKey]: itemSize }), [itemKey, itemSize]);
    // 设置移动容器的样式
    const wrappStyle = useMemo(() => ({ [itemKey]: itemSize * count }), [count, itemSize, itemKey]);
    
    return (
    	<div ref={root} style={props.style} className="lumu-swipe">
            <div style={wrappStyle} className={`lumu-swipe__container ${vertical ? 'lumu-swipe__vertical' : ''}`}>
            {
                React.Children.map(props.children, (child, index) => {
                    if (!React.isValidElement(child)) return null
                    if (child.type !== SwipeItem) return null;
                    // 通过cloneElement来对child进行props传递
                    return React.cloneElement(child, {
                        style: itemStyle,
                        vertical: vertical
                    })
                });
            }	
            </div>
        </div>
    )
}
```
```typescript
// SwipeItem.tsx
import React from 'react';
import './style.less';
const SwipeItem:React.FC<SwipeItemProps> = (props) => {
    const { children, style, vertical } = props;

    return (
        <div className="lumu-swipe__item"} style={style}>
            {children}
        </div>
    )
};
```

```less
// style.less
@name: lumu;

.@{name}-swipe {
    overflow: hidden;
    &__container {
        display: flex;
        align-items: center;
        height: 100%;
    }
    &__vertical {
        flex-direction: column;
    }
    &__item {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
    }
}
```

### 第二步，移动容器（核心）
此时基本可以看到一个静态的轮播图布局了，接下来开始核心的内容。核心内容均封装在一个useSwipe的hook方法里面，通过useSwipe暴露的方法，后期去实现自动播放、手势滑动等等功能

```typescript
// Swipe.tsx
	...同上省略
     // 核心方法
    const { 
        swipeRef, // 移动容器的ref
        setRefs, // 设置子组件ref
        current, // 当前索引
        slideTo, // 移动位置
        next, // 通过slideTo封装的快速移动方法
        prev, // 通过slideTo封装的快速移动方法
        loopMove, // 通过slideTo封装的循环移动方法
    } = useSwipe({ count, vertical, duration, size: itemSize, loop }); 
    
    return (
    	<div ref={root} style={props.style} className="lumu-swipe">
            <div ref={swipeRef} style={wrappStyle} className={`lumu-swipe__container ${vertical ? 'lumu-swipe__vertical' : ''}`}>
            {
                React.Children.map(props.children, (child, index) => {
                    if (!React.isValidElement(child)) return null
                    if (child.type !== SwipeItem) return null;
                    // 通过cloneElement来对child进行props传递
                    return React.cloneElement(child, {
                        style: itemStyle,
                        vertical: vertical,
                        // 通过setRefs挂载子组件实例，用于后期的移动
                        ref: setRefs(index)
                    })
                });
            }	
            </div>
        </div>
    )
```


```typescript
// useSwipe.ts
import { useRef, useState, useMemo, useEffect } from 'react';
import { SwipeItemRef } from '../SwipeItem';
import useRefs from './useRefs';

type SwipeParams = {
    count: number;
    vertical: boolean;
    duration: number;
    size: number;
    loop: boolean;
}

type SlideToParams = Partial<{
    step: number;
    swiping: boolean;
    offset: number;
}>;

const useSwipe = (options: SwipeParams) => {
    const { count, vertical, duration, size, loop } = options;
    // 当前索引
    const [current, setCurrent] = useState(0);
    // 计算索引，也是抛出到外部的索引。
    const realCurrent = useMemo(() => (current + count) % count || 0, [current, count]);
    // 移动容器
    const swipeRef = useRef<HTMLDivElement>(null);
    // 这个方法主要是挂载子组件实例，偏于后面操作子组件移动位置
    const [refs, setRefs] = useRefs<SwipeItemRef>();
    // 最小索引值
    const minCurrent = useMemo(() => loop ? -1 : 0, [loop]);
    // 最大索引值
    const maxCurrent = useMemo(() => loop ? count : count - 1, [loop, count]);
    // 当前移动方向
    const loopDirection = useRef<1|-1>(1);
	
    // 监听索引，来改变当前移动方向
    useEffect(() => {
        if (realCurrent === 0) {
            loopDirection.current = 1;
        }
        if (realCurrent === count - 1) {
            loopDirection.current = -1;
        }
    }, [realCurrent]);

    // 设置移动容器的位置和是否有移动动画
    const setStyle = (dom: HTMLDivElement | null, options: { swiping: boolean, offset: number }) => {
        if (!dom) return;
        const { swiping, offset } = options;
        dom.style.transition = `all ${swiping ? 0 : duration}ms`;
        dom.style.transform = `translate${vertical ? 'Y' : 'X'}(${offset}px)`;
    }
    // 复位容器
    const resetCurrent = () => {
        setStyle(swipeRef.current, {
            swiping: true, offset: -realCurrent * size
        })
    }
    // 重置子组件位置
    const resetChild = (step: number, offset: number) => {
        let direction = '';
        if (step < 0 || offset > 0) {
            direction = 'left';
        }
        if (step > 0 || offset < 0) {
            direction = 'right';
        }
        if ([-1, count - 1].includes(current)) {
            refs[0].setOffset(direction === 'right' ? count * size : 0);
            refs[refs.length - 1].setOffset(0);
        }
        if ([count, 0].includes(current)) {
            refs[0].setOffset(0);
            refs[refs.length - 1].setOffset(direction === 'right' ? 0 : -count * size)
        }
    }
	
    // 移动容器，step移动的步数， swiping是否关闭动画， offset偏移量，主要用于手势移动
    const slideTo = ({ step = 0, swiping = false, offset = 0 }: SlideToParams) => {
        if (count <= 1) return;
        // 如果是无缝轮播，就需要移动之前重置子组件位置
        loop && resetChild(step, offset);
        // 计算将要到达的索引
        const fetureCurrent = Math.min(Math.max(realCurrent + step, minCurrent), maxCurrent);
        // 计算移动的偏移量
        const fetureOffset = -fetureCurrent * size + offset;
        if (swiping) {
            setStyle(swipeRef.current, {
                swiping, offset: fetureOffset
            });
        } else {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setStyle(swipeRef.current, {
                        swiping, offset: fetureOffset
                    });
                })
            })
        }
        setCurrent(fetureCurrent);
    }

    const next = () => {
        resetCurrent();
        slideTo({ step: 1 });
    }

    const prev = () => {
        resetCurrent();
        slideTo({ step: -1 });
    }

    const loopSwipe = () => {
        if (loop) {
            next();
            return;
        }
        if (loopDirection.current === 1) {
            next();
        } else {
            prev();
        }
    }

    return {
        swipeRef,
        setRefs,
        current: realCurrent,
        slideTo,
        next,
        prev,
        loopSwipe
    }
}

export default useSwipe;
```

```typescript
// SwipeItem.tsx
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { SwipeProps } from './Swipe';

interface SwipeItemRef {
    setOffset: React.Dispatch<React.SetStateAction<number>>
}

interface SwipeItemProps {
    readonly vertical?: SwipeProps['vertical'];
    readonly style?: React.CSSProperties;
    children: React.ReactNode;
}

const SwipeItem = React.forwardRef<SwipeItemRef, SwipeItemProps>((props, ref) => {
    const { children, style, vertical } = props;
    const [offset, setOffset] = useState(0);
    const swipeItemRef = useRef<HTMLDivElement>(null);
    
    useImperativeHandle(ref, () => {
        return {
            setOffset
        }
    });

    const itemStyle = useMemo(() => {
        return {
            transform: offset ? `translate${props.vertical ? 'Y' : 'X'}(${offset}px)` : '',
            ...style
        }
    }, [offset, style, vertical]);

    return (
        <div ref={swipeItemRef} className={"lumu-swipe__item"} style={itemStyle}>
            {children}
        </div>
    )
});
```

### 第三步，手势处理
针对于手势，封装到了一个useTouch方法里，主要是记录手势时间，手势的差值
```typescript
// useTouch.ts
import { useRef } from 'react';

const useTouch = () => {
    const startX = useRef<number>(0); // 起点X坐标
    const startY = useRef<number>(0); // 起点Y坐标
    const deltaX = useRef<number>(0); // 移动的X坐标距离
    const deltaY = useRef<number>(0); // 移动的Y坐标距离
    const time = useRef<number>(0); // 时间记录

    const reset = () => {
        startX.current = 0;
        startY.current = 0;
        deltaX.current = 0;
        deltaY.current = 0;
        time.current = 0;
    }

    const start = (event: React.TouchEvent | TouchEvent) => {
        reset();
        time.current = new Date().getTime();
        startX.current = event.touches[0].clientX;
        startY.current = event.touches[0].clientY;
    }

    const move = (event: React.TouchEvent | TouchEvent) => {
        if (!time.current) return;
        deltaX.current = event.touches[0].clientX - startX.current;
        deltaY.current = event.touches[0].clientY - startY.current;
    }

    const end = () => {
        const tempDeltaX = deltaX.current;
        const tempDeltaY = deltaY.current;
        const timediff = new Date().getTime() - time.current;
        reset();
        return {
            deltaX: tempDeltaX,
            deltaY: tempDeltaY,
            time: timediff
        }
    }

    const getDelta = () => {
        return {
            deltaX: deltaX.current,
            deltaY: deltaY.current
        }
    }

    return {
        move, start, end, getDelta
    }
}
```
```typescript
// SwipeItem.ts
...重复代码省略
const touch = useTouch();

const onTouchStart = (event: React.TouchEvent | TouchEvent) => {
    if (!touchable) return; 
    touch.start(event);
}

const onTouchMove = (event: React.TouchEvent | TouchEvent) => {
    if (!touchable) return; 
    touch.move(event);
    const { deltaX, deltaY } = touch.getDelta()
    slideTo({ swiping: true, offset: vertical ? deltaY : deltaX });
}

const onTouchEnd = () => {
    if (!touchable) return; 
    const { deltaX, time, deltaY } = touch.end();
    const delta = vertical ? deltaY : deltaX;
    const step = (itemSize / 2 < Math.abs(delta) || Math.abs(delta / time) > 0.25) ? (delta > 0 ? -1 : 1) : 0;
    slideTo({ swiping: false, step });
}
```

### 第四步，细节分支功能处理
细节功能主要是通过上面的核心内容进行扩展，这里不再贴代码，[完整源码可查看这里地址](https://github.com/wenlei0617/lumu-swipe)，主要有以下几点：
1. 自动轮播，通过调用loopMove方法即可实现
2. onSlideChange方法实现，通过监听current索引调用
3. 页面visiblity处理，通过监听页面visiblity来开启停止自动轮播
4. 纵向轮播时，禁止touchmove冒泡
5. 通过useImperativeHandle抛出next, prev, slideTo方法
6. showIndicators属性的实现，也是通过slideTo和current实现dot组件，再通过属性进行显示隐藏

[示例地址](http://49.235.254.79/lumu-swipe/)

### 往期回顾
- [逐步拆解React组件—Lazyload懒加载](https://juejin.cn/post/6930860373830696973)

### 最后

> 觉得有用？喜欢就收藏，顺便点个赞吧，你的支持是我最大的鼓励！觉得没用？评论区交流您的想法，虚心接受您的指导。


