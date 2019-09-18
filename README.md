## Redux实例V3.0版

> 基于LoanPlatform分支改造
> 说明：在已有项目的基础上，新增redux功能
> 错误解决：之前将文件夹名称更改后，运行react-native run-android命令后，项目运行起来，但是服务没起来，导致项目运行失败。

### V3.1 redux基础框架

> 目标：在原项目的基础上，参照项目AwesomeProject搭建redux基础框架
> 实现功能：实现redux控制App.js页面相关的参数，如global.js中的相关参数(ip, token, isLogin, basicAuth, appChannel, cityData)
> 修改文件

* 新增框架文件：redux目录下相关
* App.js, package.json

### V3.2 state更新

> 目标：在子组件中获取state,并尝试更改
> 实现功能：子组件获取state相关状态值，并通过dispatch改变状态值
> 修改文件：新增redux/components/home.js文件

### V3.3 navigation混合导航

> 实现功能：加入react-navigation混合导航，Home.js嵌入FirstScreen.js
> redux/pages/screen，redux/router.js，components/common/TabBarModel.js等相关文件
> home.js修改为Home.js，从components文件夹移入redux/pages；添加ScrollView滚动

### V3.4 轮播

> 实现功能：BannerModel广告轮播功能
> 修改文件：redux/components/common/BannerModel.js

### V3.5 分类块

> 实现功能：CategoryModel分类块展示
> 修改文件：redux/components/common/CategoryModel.js

### V3.6 产品列表

> 实现功能：(1)DailyProductList产品列表展示功能
> redux/components/common/ProductItemModel.js
> redux/components/DailyProductList.js

### V3.7 头部展示

> 实现功能：产品列表展示功能,头部模块HeadModel
> redux/components/common/ProductItemModel.js
> redux/components/DailyProductList.js
> redux/components/PopularProductList.js
> redux/components/common/HeadModel.js

### V3.8 表单

> 实现功能：表单功能
> 修改文件：redux/components/common/CalculateModel.js
