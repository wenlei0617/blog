---
title: Jest单元测试之旅—实践总结
date: 2022-08-09 18:18:44
tags:
---

> 前言：之前对于单元测试仅仅处于了解的状态，并且在实际开发中并没有用到。今年在新环境下开启了单元测试之旅，对单元测试进行更细致的入门学习，为此对单元测试进行了总结

本文主要是对近期单元测试开发的总结回顾，本文主要围绕以下内容进行分析：

- 什么是单元测试？
- 为什么要写单元测试？
- 怎么写单元测试？

# 什么是单元测试？
维基百科对于单元测试的定义：是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。程序单元是应用的最小可测试部件。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

而针对与我们前端来说，我认为单测就是：UI测试和逻辑测试，逻辑测试包含：工具类/函数、业务相关代码测试。UI测试分为：公共组件和业务组件测试。
    
# 为什么要写单元测试？
在前端开发中单测本身并不是被特别看重的环节，特别是大部分人作为业务开发在如此卷的环境下、业务不断迭代，单测带来的好处并不能被完全发现，反之前期会让人觉得浪费时间并且耽误开发进度。大部分单测的代码量都大于了实现，那为什么我们还要鼓励写单测呢？我认为，单测就像基金，需要长期持有才能看到本身的价值，特别是项目不断的迭代、人员流失以至于在后期的维护中单测就越发的重要，它是让你大胆修改或重构代码的基石，在《重构》一书中，第一章节就讲到：“重构的第一步是确保即将修改的代码拥有一组可靠的测试”。足以说明单测的重要性。

它能带来的好处我总结有：

1. 单测可以确保程序得到预期的结果，验证功能完备性
2. 促使开发者写可测试的代码和整洁的代码结构，易测试的代码间接说明代码质量的好坏
3. 提前发现Bug和边界值处理，降低风险
4. 重构时能保证重构的正确性
5. 测试可以作为其他开发人员理解代码行为的方式之一

因为作为业务开发且前端是作为和用户最近的一层，特别是交互和视觉上对于前端来说极其不稳定的。所以在我们决定要写单测时，应该考虑我们的优先级：公共方法 > 核心逻辑 > 公共组件 > 业务组件。对于UI层的多变上，我们应该尽量满足我们的公共方法和核心逻辑的测试覆盖，UI上若有强烈需求再进行覆盖，因为在业务开发中，UI上的单测投入回报率并不高且是多变的并不需要刻意为了单测而单测。

# 怎么写单元测试
## 选择单元测试工具
工欲善其事，必先利其器。单测也是这样，在前端领域内也是出现了很多单测工具，包括：Jest、Mocha、AVA；针对不同框架测试UI的库有：React Testing Library 、Vue Testing Library。这里针对自身场景选择合适的工具既可以，因为我们业务主要使用React，而Jest和React Testing Library则是我们最佳的选择。下面也主要围绕该工具进行介绍。

Jest本身支持产出代码测试的覆盖率，而覆盖率则是评判单测的好坏途径之一（并不是唯一，再次提及我们不能为了单测而单测）。我们通常用得到一份这样的覆盖率报告：

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f08ad5f7de84f7caacd715f355abcf2~tplv-k3u1fbpfcp-watermark.image?" alt="" width="100%" />

图中对应的列的解释：

%stmts：语句覆盖率，指是否每个语句都覆盖到了

%branch：分支覆盖率，指是否每个if代码块都覆盖到了

%funcs：函数覆盖率，指是否每个函数都覆盖到了

%lines：行覆盖率，是否每一行都覆盖到了

我们可以通过查看报告来发现我们未覆盖的代码

## 搭建单元测试环境
在我们使用大部分前端框架时其实已经内置了jest的环境，如vue-cli/umi等，所以并不需要大家从0开始搭建，大部分只需要修改配置即可快速使用。这里简单搭建typescript+jest环境已供我们学习使用。


```js
yarn add typescript ts-node ts-jest jest @types/jest jest-environment-jsdom -D
```
如果jest是28以上版本，jest-environment-jsdom需要单独安装。初始化jest配置

```js
npx jest --init
```
根据提示生成你的config配置，以下是我的配置内容
```ts
export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  preset: 'ts-jest',
  testEnvironment: "jsdom",
};
```

源码可至[github下载](https://github.com/wenlei0617/jest-example)。之后文中的每一组测试均可在源码中找到

## 单元测试实践
### 一、常用API
在开始正式的代码测试前，我们先认识一下常用的基础Jest API内容。最简单的测试单元如下：
```ts
// tests/example1.test.ts
import { add } from '../src/example1';

describe('add', () => {
  it('1 + 1', () => {
    expect(add(1, 1)).toEqual(2);
  })
})
```
其中describe的作用是它会形成一个作用域块，并且描述接下来我们要测试的内容。it接受2个参数，第一个参数用于描述测试方法，第二参数接受一个函数用于测试。expect用于对结果断言，来判断当前结果是否符合预期。

其中toEqual是jest提供的匹配器，jest提供了非常多的匹配器，这里列举一些常用：

- toBe：使用Object.is精准匹配
- toEqual：相比toBe会做深层比较，一般用于检测对象的值
- toBeNull/toBeUndefined/toBeTruthy/toBeFalsy：与语义一致，我理解为toEqual的封装
- toBeCalled 是否被调用
- toBeCalledTimes 被调用次数

更多内容可移至[Jest官网](https://jestjs.io/docs/using-matchers)。

下面会根据各种场景进行分析
### 二、异步函数
在我们实际开发中我们会遇到很多异步函数，但是因为Jest在进行测试时，默认情况下一旦到达运行上下文底部当前测试立即结束，这样意味着测试将不能按照我们的预期进行，好在Jest在针对异步函数测试也提供了我们多种方法。包含：async/await、resolves/rejects、手动调用done。

async/await：可以在传递给`it`的函数前面加上`async`，这样就和我们写代码时是一样的，会依次执行。
resolves/rejects：Jest会等待异步函数执行完毕该方法应该和async/await配合使用
手动调用done：在我们没有调用done之前，当前测试不会结束，直至调用done方法，有点类似回调。如果一直没有调用会导致超时并且当前用例失败。


示例如下：

```ts
// src/example2.ts
import { wait } from './helper';

export const asyncResolveFunc = async (result: number) => {
  await wait(100);
  return Promise.resolve(result)
}

export const asyncRejectFunc = async (error: string) => {
  await wait(100);
  return Promise.reject(error);
}
```
对应得测试用例：

```ts
// tests/example2.test.ts
import { asyncRejectFunc, asyncResolveFunc } from '../src/example2'

describe('async/await', () => {
  it('expect async resolve', async () => {
    const result = await asyncResolveFunc(1);
    expect(result).toBe(1);
  })

  it('expect async reject', async () => {
    try {
      await asyncRejectFunc('error')
    } catch (error) {
      expect(error).toEqual('error');
    }
  })
})

describe('resolves/rejects', () => {
  it('expect resolves', async () => {
    await expect(asyncResolveFunc(1)).resolves.toBe(1);
  });

  it('expect rejects', async () => {
    await expect(asyncRejectFunc('error')).rejects.toEqual('error');
  });
})

describe('done', () => {
  it('done resolve', (done) => {
    asyncResolveFunc(1).then((value) => {
      expect(value).toBe(1);
      done();
    })
  })

  it('done reject', (done) => {
    asyncRejectFunc('error').catch((value) => {
      expect(value).toEqual('error')
      done();
    })
  });
})
```

### 三、定时器
日常开发中，我们难免会遇到使用setTimeout\setInterval，刚刚在异步用例中wait函数其实就是通过setTimeout进行包装的，这个示例中我们重点分析应该如何测试定时器。
示例代码：

```ts
// src/example3.ts
import { wait } from './helper';

export const setTimeoutFunc = async () => {
  await wait(1000 * 5 * 60);
  return Promise.resolve('success')
}
```
该代码需要等待5分钟后才返回成功，此时我们仿造之前的例子编写测试代码

```ts
// tests/example3.test.ts
import { setTimeoutFunc } from '../src/example3'

describe('setTimeout timeout', () => {
  it('setTimeoutFunc', async () => {
    const result = await setTimeoutFunc();
    expect(result).toEqual('success');
  })
})
```
运行测试后发现测试报错了，提示超时了。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a270393f9b0b4102b5dc8b57b068e4f4~tplv-k3u1fbpfcp-watermark.image?)
这是因为Jest默认的超时时间为5秒，但是我们在进行测试时不会真的等那么久，这时候Jest就提供了一系列工具方法解决该问题。

| 方法 | 用途 |
| --- | --- |
| useFakeTimers | 启动假定的定时器来替换setTimeout或其他定时器 |
| useRealTimers | 与useFakeTimers相反，是恢复真实的定时器 |
| runAllTimers | 运行所有的定时器 |
| runOnlyPendingTimers | 运行当前队列中等待的定时器 |
| advanceTimersByTime | 调用此API时，所有计时器都会提前到传入的毫秒 |

这里我们使用useFakeTimers和runAllTimers即可完成该测试
```ts
// tests/examples3-1.test.ts
import { setTimeoutFunc } from '../src/example3'

describe('setTimeout timeout', () => {
  it('setTimeoutFunc', async () => {
    // 启动假的定时器
    jest.useFakeTimers();
    const result = setTimeoutFunc();
    // 运行所有定时器
    jest.runAllTimers();
    expect(result).resolves.toEqual('success');
  })
})
```

现实开发中，我们不只是单个定时器任务运行，有时候会存在循环调用，而循环调用则无法通过runAllTImers进行测试，如下：

```ts
// tests/example4.test.ts
import { loopTime } from '../src/example4';

describe('loopTime', () => {
  it('loopTime', async () => {
    jest.useFakeTimers();
    // 这里使用mock方法，后续会单独讲到mock相关内容
    const fn = jest.fn();
    loopTime(fn);
    jest.runAllTimers();
    expect(fn).toBeCalled();
  })
})
```
运行后会发现控制台提示`Aborting after running 100000 timers, assuming an infinite loop!`，是因为jest.runAllTimers会运行所有定时器，而我们需要测试的代码是不会停止的。这个时候就需要使用`runOnlyPendingTimers`或者`advanceTimersByTime`进行处理；示例如下：

```ts
// tests/example4-1.test.ts
import { loopTime } from '../src/example4';

describe('loopTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  })

  it('runOnlyPendingTimers', () => {
    const fn = jest.fn();
    loopTime(fn);
    jest.runOnlyPendingTimers();
    expect(fn).toBeCalled();
  });

  it('advanceTimersByTime', async () => {
    const fn = jest.fn();
    loopTime(fn);
    jest.advanceTimersByTime(1000);
    expect(fn).toBeCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(fn).toBeCalledTimes(2);
  })
})
```
这里我们使用到了`afterEach`和`beforeEach`，该方法主要是在每个it之前和之后执行，主要处理每个测试中公共内容避免重复编写，该测试能正常通过。

在实际开发中，我们还会遇到另一种情况，当我们的循环定时器方法内是一个异步函数，如下：

```ts
// src/example5.ts
export const asyncLoopTime = (callback: Function) => {
  setTimeout(() => {
    Promise.resolve().then(() => {
      callback();
      asyncLoopTime(callback)
    })
  }, 1000)
}
```
此时我们编写测试用例
```ts
// tests/example5.test.ts
import { asyncLoopTime } from '../src/example5';

describe('asyncLoopTime', () => {

  it('runOnlyPendingTimers error', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    asyncLoopTime(fn);
    jest.runOnlyPendingTimers();
    expect(fn).toBeCalled();
  });
})
```
运行后发现fn被调用的0次，测试用例并没有通过。导致该错误的原因是因为我们在使用runOnlyPendingTimers时，把定时器执行到了setTimeout内部，但是内部的执行代码是Promise.then，它是一个微任务，微任务会被推到事件队列中，js会先执行其他任务（expect），再执行微任务，这样导致我们的fn断言时并没有被调用。在此我们可以通过对我们的测试用例进行微任务处理及可以把顺序“纠正”，修改后的测试用例：
```ts
// tests/example5.test.ts
import { asyncLoopTime } from '../src/example5';

describe('asyncLoopTime', () => {
  it('runOnlyPendingTimers success', async () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    asyncLoopTime(fn);
    jest.runOnlyPendingTimers();
    // 通过手动使用Promise来创造微任务
    await Promise.resolve();
    expect(fn).toBeCalled();
  });
})
```

### 四、Mock模块
Mock是我认为单测中最重要的一个测试手段。为什么我们需要进行Mock数据呢？

第一：在有些情况下我们没办法在测试环境中使用一些API或全局的方法，此时Jest提供的Mock方法是解决问题该重要手段。

第二：我们测试某个方法时，可能当前方法会夹杂对其他外部方法的调用，如果外部方法并不是一个纯函数，此时我们不应该再对外部方法再进行测试，而是通过Mock方式去模拟它。

Jest提供的mock方法主要有：`jest.fn`、`jest.mock`、`jest.spyOn`。每个方法都有不同的使用场景，每个API都会生成一个mock模拟函数，Jest对模拟函数提供了很多方法给予我们模拟方法的返回、实现等等，[可移至文档参考](https://jestjs.io/docs/mock-function-api)
#### jest.fn
`jest.fn`主要是创建一个模拟函数，用于代替我们的真实函数，可以通过该模块函数提供的方法获取调用信息（.mock方法）。示例：
```ts
// src/example6.ts
export const mockTestFunc = (fn: Function, execute: boolean) => {
  return execute ? fn(execute) : undefined;
}
```

```ts
// tests/example6.test.ts
import { mockTestFunc } from '../src/example6'

describe('mockTestFunc', () => {
  it('execute true', () => {
    const fn = jest.fn();
    mockTestFunc(fn, true);
    expect(fn).toBeCalled();
    expect(fn.mock.calls[0][0]).toBeTruthy();
  });

  it('execute false', () => {
    const fn = jest.fn();
    const result = mockTestFunc(fn, false);
    expect(fn).not.toBeCalled();
    expect(result).toBeUndefined();
  })
})
```
#### jest.mock 与 jest.spyOn
针对jest.mock与jest.spyOn产生一系列关联的API，如下：

| 方法 | 作用 |
| --- | --- |
| jest.mock | 模拟整个模块 |
| jest.spyOn | 模拟一个特定功能 |
| jest.clearAllMocks \| .clearMock | 清空所有存储在`mockFn.mock.calls`, `mockFn.mock.instances`, `mockFn.mock.contexts`的信息和`mockFn.mock.results` 数组 |
| jest.resetAllMocks \| .resetMock | 重置mock，但是不会恢复实现，也就是说它还是一个被模拟的方法 |
| jest.restoreAllMocks \| .restoreMock | 恢复原本实现，只能用于jest.spyOn创建的模拟，其他Mock需要手动恢复 |

其中jest.restoreAllMocks \| .restoreMock 比较特别，只能用于jest.spyOn创建的模拟，因为`jest.spyOn`包装了原始功能，并提供了`mockRestore`作为恢复原始功能的方法。而`jest.mock`的调用方式有所不同。Jest接管require系统，`jest.mock`告诉Jest，它在需要时应返回模块模拟，而不是实际模块。这意味着模块模拟不会包装原始模块，它会完全替换require系统中的原始模块。因此，`mockRestore`可以在模拟模块中的模拟函数上定义，但是调用它不会恢复原始实现。

这里分别使用了jest.spyOn和jest.Mock两个方式对同一个方法进行3种不同编写方式的测试，在实际情况中我们应该选择合适的方法。

示例：

```ts
// src/example7.ts
import { randomNumber } from './helper'

export const mockTestExternalFunc = () => {
  const result = randomNumber();
  return result % 2 ? 'odd' : 'even';
}
```

jest.mock 配合 jest.clearAllMocks、jest.resetAllMocks

```ts
// test/example7.test.ts
import { mockTestExternalFunc } from '../src/example7';
import * as helper from '../src/helper';

jest.mock('../src/helper.ts');

describe('mockTestExternalFunc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  })
  it('even', () => {
    const fn = (helper.randomNumber as jest.Mock)
    fn.mockReturnValue(10)
    expect(mockTestExternalFunc()).toEqual('even');
    expect(fn).toBeCalledTimes(1);
  });

  it('odd', () => {
    const fn =(helper.randomNumber as jest.Mock)
    fn.mockReturnValue(9)
    expect(mockTestExternalFunc()).toEqual('odd');
    expect(fn).toBeCalledTimes(1);
  })
})
```

jest.spyOn 配合 jest.restoreAllMocks

```ts
// test/example7-1.test.ts
import { mockTestExternalFunc } from '../src/example7';
import * as helper from '../src/helper';

describe('mockTestExternalFunc', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  })
  it('even', () => {
    const fn = jest.spyOn(helper, 'randomNumber')
    fn.mockReturnValue(10);
    expect(mockTestExternalFunc()).toEqual('even');
    expect(fn).toBeCalledTimes(1);
  });

  it('odd', () => {
    const fn = jest.spyOn(helper, 'randomNumber')
    fn.mockReturnValue(9);
    expect(mockTestExternalFunc()).toEqual('odd');
    expect(fn).toBeCalledTimes(1);
  })
})
```

使用jest.mock模拟部分函数，这里使用了`jest.requireActual`，该方法主要是绕过模拟模块导出真实模块，然后通过jest.mock的工厂函数重新去定义该模拟模块的内容，这种方式就可以指定导出的模块具体哪些方法需要被模拟。

```ts
import { mockTestExternalFunc } from '../src/example7';
import * as helper from '../src/helper';

jest.mock('../src/helper.ts', () => {
  const helper = jest.requireActual('../src/helper.ts');
  return {
    ...helper,
    randomNumber: jest.fn()
  }
});

describe('mockTestExternalFunc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  })
  it('even', () => {
    const fn = (helper.randomNumber as jest.Mock)
    fn.mockReturnValue(10)
    expect(mockTestExternalFunc()).toEqual('even');
    expect(fn).toBeCalledTimes(1);
  });

  it('odd', () => {
    const fn =(helper.randomNumber as jest.Mock)
    fn.mockReturnValue(9)
    expect(mockTestExternalFunc()).toEqual('odd');
    expect(fn).toBeCalledTimes(1);
  })
})
```

### 五、Mock全局对象
在实际开发中，我们总会遇到localStorage、location等等这类内置的API使用，而在我们测试环境下因为没有直接在浏览器上操作，所以并不能直接访问此类属性或方法，但得益于jsdom，它提供了强大的web沙箱环境让我们能直接模拟真实的web环境。还有一种情况是，我们自定义或者第三方提供的全局sdk此时需要通过其他手段进行模拟测试。这里通过localStorage和自定义birdage进行举例说明：

```ts
// src/example8.ts
export const getLocalStorage = () => {
  return localStorage.getItem('test');
}

export const setLocalStorage = (value: string) => {
  localStorage.setItem('test', value);
}

export const callPhone = () => {
  return window.bridage.callPhone();
}
```
上诉代码中，我们编写了一个`window.bridage`对象，用于存储我们全局的对象相关的API。如果我们在测试用例中直接访问window.bridage.callPhone时，会提示`Cannot read properties of undefined`，因为jsdom中并没有对应的api实现，所以我们需要在测试前构造一个模拟的方法。这里我们通过js中`Object.defineProperty`来修改window中bridage的属性，从而达到模拟的效果。因为在测试中我们可能会多次用到，为了避免重复的代码，这里我们使用了`beforeAll`进行处理，与之对应的是`afterAll`。它们两的作用主要是文件内所有测试开始或结束前执行的钩子函数。我们在开始前对window.bridage进行模拟保证每个用例能正确获取它。

```ts
import { callPhone, getLocalStorage, setLocalStorage } from '../src/example8'

describe('localStroage', () => {
  let callPhoneMock = jest.fn();
  beforeAll(() => {
    Object.defineProperty(window, 'bridage', {
      writable: true,
      value: {
        callPhone: callPhoneMock
      }
    });
  });

  afterEach(() => {
    callPhoneMock.mockClear();
    callPhoneMock.mockReset();
  })

  it('set 1, get 1', () => {
    setLocalStorage('1');
    expect(getLocalStorage()).toBe('1');
  });

  it('callPhone', () => {
    callPhoneMock.mockReturnValue('10086')
    expect(callPhone()).toEqual('10086')
    expect(callPhoneMock).toBeCalled();
  });
})
```

### 六、Mock类方法
大部分类的测试和上述测试基本一致，只是从函数或者对象变成了类。在类中我们可以使用private对方法进行私有化，此时我们在单测时没办法直接访问或者模拟。需要通过对私有成员使用数组访问或者通过`prototype`属性进行模拟。示例如下：

```ts
import { randomNumber } from './helper';

class LocalCache {
  cache: Record<string, string> = {};

  get(name: string) {
    return this.cache[name];
  }

  set(name: string, value: string | object) {
    this.cache[name] = this.transform(value);
  }

  private transform(value: string | object): string {
    let result = '';
    if (typeof value === 'object') {
      result = JSON.stringify(value);
    } else {
      result = value;
    }
    return `${result}-${randomNumber()}`
  }
}

export default LocalCache;
```
为了使transform不是一个纯方法，这里使用randomNumber来使其返回值不稳定，这个时候如果我们直接测试set方法，就需要模拟transform，但是private方法不能直接通过`jest.spyOn(LocalCache, 'transform')`模拟，会导致测试报错并提示`Cannot spy the transform property because it is not a function; undefined given instead`，其实class就是ES6提供的一个语法糖，本质还是一个函数，那这里我们就可以通过prototype来获取它并进行模拟。示例：

```ts
import LocalCache from '../src/example9'
import * as helper from '../src/helper';

describe('LocalCache', () => {
  let randomNumberMock: jest.SpyInstance;
  beforeAll(() => {
    randomNumberMock = jest.spyOn(helper, 'randomNumber');
  })

  afterEach(() => {
    randomNumberMock.mockClear();
    randomNumberMock.mockReset();
    randomNumberMock.mockRestore();
  })
  it('transform string', () => {
    jest.spyOn(helper, 'randomNumber').mockReturnValue(10);
    const cache = new LocalCache();
    expect(cache['transform']('test')).toEqual('test-10');    
  });

  it('transform object', () => {
    jest.spyOn(helper, 'randomNumber').mockReturnValue(5);
    const cache = new LocalCache();
    expect(cache['transform']({a : 1})).toEqual(`${JSON.stringify({a: 1})}-5`);
  });

  it('mock private', () => {
    jest.spyOn(LocalCache as any, 'transform').mockReturnValue('1-1');
    const cache = new LocalCache;
    cache.set('test', '1')
    expect(cache.get('test')).toEqual('1-1');
  })
})
```
# 总结
上述主要是对我们常见的测试情况进行了一个分类总结，在实际开发中我对于测试原则做了一些总结：
1. 减少面向实现细节设计测试，转而使用面向行为来测试（BDD）。原因是如果依赖被测试功能的实现逻辑意味着修改实现逻辑但是输入输出没有变化也需要去更新测试代码。
2. 一条测试保证只测试一种情况
3. 只测试方法内逻辑，如果有引入其他方法（非纯函数）通过mock处理，避免跳出当前测试代码

# 最后
我对单元测试得理解：如果只是为了测试用例能跑通代码的话，那单测对于我们来说意义并不大。我认为单测更像是去review代码并查看代码得不合理，这样才能让我们得代码更健壮。


















