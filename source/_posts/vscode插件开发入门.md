---
title: vscode插件开发入门
date: 2022-09-29 17:44
tags:
---

> 导读：如果你是一名vscode使用者，一定会安装了很多插件来为平时开发进行提效，是否有时候发现插件并不能满足自身的需求，此时就需要自己开发一款插件来完成的诉求。本篇文章通过简单的插件开发为你拉开序幕，让你从中了解插件开发流程和插件本身能力范围。

## vscode插件能做什么
在我们日常使用中，会安装很多插件，如： 主题、Prettier、code snippets、Eslint、Jest Runner、Git等等。每种插件都能解决我们实际开发中的某一块诉求。我把所有的插件大致归为三类：UX/UI类、语言类、工具类

### UX/UI类（主题插件、预览插件等）
UX类插件主要用于增强用户交互行为，通过新增工作台、扩展工作台或对工作台添加自定义组件和视图。主要集中在以下的更改：
- 自定义上下文菜单操作，如：平时我们右键的菜单栏
- 在侧边栏创建自定义交互，如：npm插件安装后在资源管理中-主侧边栏添加了一个npm操作视图
- 定义一个新的活动栏视图，如：Git插件安装后左侧活动栏中的图标
- 在状态栏中显示自定义信息，如：Git插件安装后显示当前分支
- 使用webview自定义内容，如：markdown预览插件提供预览的视图


UI类插件主要用于更改vscode的外观也就是我们常说的主题，主要集中在以下3种外观的更改：
- 更改原代码的颜色
- 更改vscode ui的颜色
- 添加自定义文件图标
    
### 语言类（Eslint、代码提示诊断功能插件等）
语言扩展（例如：悬停、转到定义、诊断错误等等），我们常见的就是eslint、prettier这类插件，该类插件通过对特定语言进行能力扩展，比如：
- 添加悬停、转到定义功能
- 诊断代码错误
- 自定义格式化代码功能
- 自定义语言添加折叠、面包屑和大纲功能

### 工具类（Code Snippets、git插件、Docker插件）
声明性语言功能（为语言添加基本的文本编辑支持），我们常用的就是各种语言或框架的Code Snippets，通过这些插件我们能直接一些模板代码片段提示开发效率，该类插件还可以提供以下功能：
- 自定义代码片段
- 自定义编程语言
- 添加或替换编程语言的语法
- 扩展现有的语法

纯工具类主要是一些第三方工具集成到vscode中，如常用的git插件、Docker插件，一般这类插件通过新增容器和视图的方式对vscode进行扩展。

## 布局解析

了解完vscode插件的扩展范围，我们再了解一下整个vscode编辑器的布局设计和概念，这样能加深对插件开发的理解。这些内容都是我们平时开发所使用到的，可能平时并没有过多的关注它在vscode中的定位，接下我们来回顾一下我们编辑器的整体布局吧

简单来说，vscode插件本质就是对我们使用的vscode进行扩展，而在扩展UX层时我们会和整个编辑器中的区域打交道，在vscode中，它把整体分为了**containers**（图一）和**items**（图二）。containers可以理解为代表编辑器的某一个区域，items可以理解为代表该区域的内容。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b224312fa2ca4977b179afbfa5ea46b3~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1fc261db28b4f4085d6e57ba9fbf54a~tplv-k3u1fbpfcp-watermark.image?)


**如图一所示containers主要包含**

- **活动栏（Activity Bar）**：重要的导航入口。我们的常用的代码管理和搜索均通过该入口进入。我们可以创建View Container并提供给Activity Bar来扩展自定义导航入口。
- **主侧边栏（Primary Sidebar）**：主要是展示一个或多个Views，活动栏和主侧边栏紧密耦合，点击活动栏可以打开对应的主侧边栏，该绑定关系通过package.json中的配置进行关联。
- **辅助边栏（Secondary Sidebar）**：主要是对主侧边栏的辅助作用，基本与主侧边栏一致
- **编辑器区域（Editor）**：我们使用的最多的区域，包含一个或多个编辑器组，可以自定义编辑器或创建Webview视图，该区域还可以对**编辑器操作栏（Editor Toolbar）** 进行扩展
- **控制面板（Panel）**：可以在面板中的单个选项卡中查看终端、问题和输出等视图。可以扩展自定义视图容器
- **状态栏（Status Bar）**：提供有关工作区的当前活动文件的上下文信息，左侧表示整个工作区的状态，右侧表示当前活动文件的状态

**如图二所示items主要包含**

- **视图（View）**：视图可以通过Tree View\Welcome View\Webview View的形式提供，视图的类型可以通过package.json中进行配置
- **视图工具栏（View Toolbar）**：主要用于扩展特定于视图的操作按钮
- **侧边栏工具栏（Sidebar Toolbar）**：主要用于扩展侧边栏的操作按钮
- **编辑器工具栏（Editor Toolbar）**：主要用于扩展编辑器区域的操作按钮
- **控制面板工具栏（Panel Toolbar）**：可以扩展当前选定视图的选项
- **状态栏（Status Bar Item）**：主要增强状态栏，左侧状态栏表示整个工作区的状态，右侧表示当前活动文件的状态


## 插件创建

> 通过以上信息，我们对vscode有大致轮廓的了解，现在我们就动手开发一款todolist的vscode插件，通过实践的方式去了解vscode中的一些基础api和开发的整体流程。

todolist功能分解
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d8ae62b13134aa28b26e9e9c6583b4f~tplv-k3u1fbpfcp-watermark.image?)

**ps: [可以通过源码配合内容逐步查看](https://github.com/wenlei0617/vscode-todolist)**

官方提供了友好的脚手架，可以直接通过命令行全局安装脚手架
> npm install -g yo generator-code

安装好后，进入你的工作目录，执行`yo code`，此时脚手架会提示你将会创建哪种vscode插件，此处我们直接选择New Extension，然后安装提示进行安装即可

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/934eb39aaff24cdabfc4d20c16a96f84~tplv-k3u1fbpfcp-watermark.image?)

创建完成后，我们先看看package.json。在package.json中有几个比较关键的配置，`activationEvents`表示当前插件激活的时机，当前配置`onCommand:todolist.helloWorld`表示当用户通过命令(ctrl+p)触发todolist.helloWorld命令时则激活插件。`contributes`表示当前插件会提供的功能，该配置则是对插件功能的配置注册。`commands`表示需要提供的命令，接收一个数组，`command`表示命令的唯一key（用于之后编写代码时注册命令使用）,`title`用于用户触发该命令的关键字。`main`表示插件的入口文件。`engines.vscode`表示使用该插件需要的vscode的最低版本，脚手架生成后默认是最新版本（如果你vscode编辑器不符合该版本则无法进行调试），按照自身需求修改vscode版本和对应的依赖中types/vscode版本。更多配置项会在后续解读
```json
{
    "name": "todolist",
    "displayName": "todolist",
    "description": "",
    "version": "0.0.1",
    "engines": {
        "vscode": "^1.71.0"
     },
     "categories": ["Other"],
     "activationEvents": [
        "onCommand:todolist.helloWorld"
     ],
     "main": "./out/extension.js",
     "contributes": {
         "commands": [
             {
                 "command": "todolist.helloWorld",
                 "title": "Hello World"
             }
	]
    },
    ...省略..
}

```

从package.json中，我们得知入口文件是out/extension.js，因为脚手架选择了typescript开发，所以入口源代码在src/extension.ts。入口文件中主要导出2个函数：`activate`插件激活时触发。`deactivate`插件被停用时触发，大多数情况我们不会用到deactivate，所以可以直接删除。

`activate`函数接受一个context对象用于获取vscode上下文，通过`vscode.commands.registerCommand`注册我们在package.json中定义的命令，并且传入一个回调函数，该回调函数会在命令执行时触发。`registerCommand`返回一个Disposable对象，我们需要通过`context.subscriptions.push`完成了todolist.helloWorld命令的注册。至此我们完成了command方法的注册与实现。当触发命令时会显示Hello World form todolist!的提示框

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e319aa5ac3dc413b93183a09a690eb55~tplv-k3u1fbpfcp-watermark.image?)

总结一下，对于command注册流程：
1. 通过package.json注册command
2. 通过vscode.commands.registerCommand传入package.json中配置的command作为唯一key进行注册
3. 把注册返回的方法添加到vscode的订阅中

大部分注册类插件的步骤大致如此

现在我们通过F5运行插件，因为脚手架配置了vscode task任务，所以会自动把ts编译成js并放入out目录。运行插件后会打开一个拥有该插件的开发环境的vscode编辑器，可以在该开发环境中进行使用当前开发的插件功能。并且可以通过vscode的断点功能进行断点调试。我们还可以通过打开vscode自带的开发者工具（帮助->切换到开发人员工具）对控制台进行查看调试


## 活动栏导航
项目创建完成后，我们开始我们的第一个功能开发——活动栏导航，活动栏导航主要是通过package.json中，先看看配置后整体的内容：

```json
"activationEvents": [
    // 绑定激活事件
    "onView:todolist-view"
],
"main": "./out/extension.js",
"contributes": {
    // 视图容器
    "viewsContainers": {
        // 注册活动栏
	"activitybar": [
            {
                "id": "todolist-container",
                "title": "待办事项",
                "icon": "assets/images/logo.svg"
            }
        ]
    },
    // 视图
    "views": {
        // 对应视图容器中注册的id
        "todolist-container": [
            {
                "id": "todolist-view",
                "name": "列表",
                "type": "webview"
            }
        ]
    }
},
```

其中`contributes.viewsContainers.activitybar`是对活动栏导航进行配置，该配置下`id`表示容器的唯一ID，views视图会通过该ID与容器建立关联关系；`title`导航入口名称，当鼠标hover上去后显示的名字；`icon`导航入口的图标，官方建议使用24\*24、单色、SVG格式的文件

配置了活动栏，我们需要对其绑定对应的视图配置。通过`contributes.views.${viewsContainerId}`配置进行关联（viewsContainerId就是viewsContainers里对应的容器id），容器与视图是一对多的关系，所以对应是一个数组格式，该数组接受一个view配置，`id`为当前view的唯一id，该id也用于之后完成该视图的数据注册传入的key；`name`表示视图的title名称；`type`表示视图的类型，默认为tree，可选值有webview。

在实际运用中，我们只有在选中当前活动栏导航时才有必要激活插件，所以为了减少不必要的开销，我们通过设置`activationEvents`为`onView:${viewId}`的方式来激活插件(viewId就是views中注册的id)，即：当前用户点击了todolist入口后，就会激活插件。

从配置上可以看出，其实viewsContainers配置就是我们在布局中提到的container，每个viewsContainer都会对应一个或多个的items，当前插件中对应的items就是注册的视图

效果图

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8ff6de0d029439c8aef3e88223f8928~tplv-k3u1fbpfcp-watermark.image?)

## 实现主侧边栏webview

刚才我们在配置中定义了视图的类型是webview，所以我们需要实现一个`WebviewViewProvider`类，该类需要实现一个`resolveWebviewView`的方法，该方法的第一个参数返回一个`webviewView`的对象，代码中可以通过该对象对webview进行操作。通过设置webview的html进行webview的渲染。viewId则是配置中该视图对应的id，用于注册使用。这里创建了todolistWebview文件用于实现该方法

```ts
import { WebviewView, WebviewViewProvider } from 'vscode';

export class TodoListWebView implements WebviewViewProvider {
  public static viewId: string = 'todolist-view';

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>todolist</title>
      </head>
      <body>
        <div>hello todolist</div>
      </body>
      </html>
    `
  }
}
```

在入口文件通过registerWebviewViewProvider方法进行注册

```ts
import * as vscode from 'vscode';
import { TodoListWebView } from './todolistWebview';

export function activate(context: vscode.ExtensionContext) {
	
	const todolistWebview = new TodoListWebView();

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(TodoListWebView.viewId, todolistWebview)
	)
}

export function deactivate() {}

```

效果图

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d176580979f1457ebb1429f72be0729f~tplv-k3u1fbpfcp-watermark.image?)

## 功能开发
上面我们已经完成了webview加载html的功能，现在使用我们熟悉的html+css+js的方式来完成这个todolist功能开发。这部分内容基本是我们熟知的开发模式不再过多描述。主要介绍我们应该如何加载静态资源和webview与脚本如果通信。

首先我们需要把js和css这类资源放到项目中，由于webview无法直接读取本地路径在设置资源路径时需要通过`webview.asWebviewUri`对路径进行转换。拼接方式为：插件路径（通过`context.extensionUri`获取当前插件路径）+ 资源路径。拼接时使用`vscode.Uri.joinPath`对路径进行拼接。 最后通过实例化TodoListWebview时把context传入类中进行使用。

```ts
export class TodoListWebView implements WebviewViewProvider {
  constructor(
    private readonly context: vscode.ExtensionContext
  ) {}
  
  resolveWebviewView(webviewView: WebviewView) {
      webviewView.webview.options = {
        enableScripts: true,
      }
  
      const cssUri = this.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'assets', 'source', 'index.css'));
      const scriptUri = this.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'assets', 'source', 'index.js'));
      
      webviewView.webview.html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>todolist</title>
            <link href="${cssUri}" rel="stylesheet"/>
          </head>
          <body>
            <div>
              <ul id="list">

              </ul>
              <div>
                <input id="input" placeholder="请输入"/>
                <button id="add">添加</button>
              </div>
            </div>
            <script src="${scriptUri}"></script>
          </body>
          </html>
        `
  }
}
```

由于webview本身默认禁止js脚本加载，所以在resolveWebviewView方法中，需要设置`webview.options.enableScripts`开启加载js脚本的能力，否则无法执行脚本文件。

其次关于通信方面，webview和脚本通过postMessage进行交互通信，webview可以使用`onDidReceiveMessage`对脚本的传输进行监听，也可以通过`postMessage`对脚本发送消息。脚本通过window.addEventListener('message', event)进行监听，而发送消息需要使用vscode在webview中全局挂载的`acquireVsCodeApi`方法，通过该方法获取到vscode提供的接口，之后通过该方法返回的对象方法中的`postMessage`对webview发送消息。其余关于todolist功能相关代码本文不做重点，可以通过源码进行查看。

脚本侧示例
```ts
(() => (
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ type: 'finishMessage' });
))()
```
webview侧接受示例：
```ts
export class TodoListWebView implements WebviewViewProvider {
    //...省略...
    resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
       this.webview.onDidReceiveMessage((message) => {
          switch (message.type) {
            case 'finishMessage':
              this.finishMessage()
              break;
            default:
              break;
          }
        });
    }
  finishMessage() {
    vscode.window.showInformationMessage('继续加油')
  }
}
```


## 数据持久化
整个Todolist功能已经基本完成了，现在我们每次关闭后vscode后，上次填写的todo数据都需要重新创建，这并不符合我们预期，我们期望能数据持久化。vscode对数据持久化的方式有：

`ExtensionContext.workspaceState`：工作空间存储，通过编写键/值对存储，并在再次打开同一个工作区时将其恢复。

`ExtensionContext.globalState`：全局存储，通过编写键/值对存储。并且可以通过setKeysForSync进行跨机器同步。


除去上面2种方式还有一种webview独有的持久化，通过上文提到的`acquireVsCodeApi()`，该方法返回的对象中拥有getState和setState方法，也是通过键/值对方式存储。保存的数据在webview切换为隐藏状态或页面内容被销毁依然可以保存，只有当webview本身被销毁时才会销毁。在todolist中我们使用此类方式进行存储。

存储示例：
```ts
  const vscode = acquireVsCodeApi();

  const state: IState[] = vscode.getState()?.todo || [];
  
  function addTodo() {
    if (input.value) {
      const li = createTodo(input.value);
      listContainer?.appendChild(li);
      state.push({
        finish: false,
        text: input.value,
        id: li.id
      });
      vscode.setState({ todo: state });
      input.value = '';
    }
  }
```

## 插件发布
完成功能开发后，我们就可以把插件打包发布到商店或打包成vsix文件，在发布前我们需要把README.md文档进行修改，修改后才能进行发布操作。这里我们使用vsix方式，需要先安装vsce包，安装后执行命令即可打包出插件。

> yarn add vsce -dev
> 
> npx vsce package

安装的方式也很多，可以直接通过vscode界面进行操作，也可以通过命令行进行安装
> code --install-extension [插件位置 *.vsix]


## 配置详解

该插件开发只涉及到了部分配置，这里把其他配置均例举出来

activationEvents

| 事件 | 备注 |
| --- | --- |
| onLanguage | 打开解析为特定语言文件时被激活，例如"onLanguage:javascript" |
| onCommand | 在调用命令时被激活 |
| onDebug | 在启动调试的时候激活 |
| workspaceContains | 每当打开文件夹并且该文件夹包含至少一个与glob模式匹配的文件时，就会发出此激活事件并激活感兴趣的扩展名。如："workspaceContains:\*\*/.editorconfig" |
| onFileSystem | 每当读取来自特定方案的文件或文件夹时。如："onFileSystem:sftp" |
| onView | 侧栏中展开指定id的视图时。如："onView:viewId" |
| onUri | 打开该扩展的系统范围Uri时 |
| onWebviewPanel | 恢复匹配viewType的webview时触发 |
| onCustomEditor | 创建具有匹配的自定义编辑器时触发 |
| onAuthenticationRequest | 每当扩展请求具有`authentication.getSession()`匹配的`providerId`是触发 |
| onStartupFinished | vscode启动后一段时间内被触发 |
| * | 在启动vscode后触发 |

contributes配置比较多，且每个配置都有对应的其他配置项，建议直接看[官网](https://code.visualstudio.com/api/references/contribution-points#contributes.breakpoints)

## 总结
本次主要针对编辑器的概念进行总结和认知插件具备的能力，通过编写的todolist来引导对插件开发流程的熟悉，其中涉及到的api并不多。但这只是vscode中的冰山一角，vscode提供了丰富的api，我们可以通过在业务中发现的痛点加上自身的想象力去diy属于自己的效率插件来补充自身对插件的理解和熟练。


