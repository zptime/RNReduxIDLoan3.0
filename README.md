Redux实例3.0版
基于IDLoanPlatform(LoanPlatform分支)改造

<!--
    说明：在已有项目IDLoanPlatform(分支：loan_platform)的基础上，新增redux功能
    错误解决：之前将文件夹名称命名为IDLoanPlatform(loan_platform)，运行react-native run-android命令后，项目运行起来，但是服务没起来，导致项目运行失败。
             运行项目时，还是得将文件夹名称改为IDLoanPlatform

    ----------------------- v1.0.0 ----------------------------
    时间：20190702
    目标：在原项目的基础上，参照项目AwesomeProject搭建redux基础框架
    实现功能：实现redux控制App.js页面相关的参数，如global.js中的相关参数(ip, token, isLogin, basicAuth, appChannel, cityData)
    修改文件：(1)新增框架文件：redux目录下相关
             (2)App.js, package.json

    时间：20190703
    目标：在子组件中获取state,并尝试更改
    实现功能：子组件获取state相关状态值，并通过dispatch改变状态值
    修改文件：新增redux/components/home.js文件

    时间：20190705
    实现功能：(1)加入react-navigation混合导航，Home.js嵌入FirstScreen.js
    修改文件：(1)redux/pages/screen，redux/router.js，components/common/TabBarModel.js等相关文件
             (2)home.js修改为Home.js，从components文件夹移入redux/pages；添加ScrollView滚动

    时间：20190708 周一
    实现功能：(1)BannerModel广告轮播功能
    修改文件：(1)redux/components/common/BannerModel.js

    时间：20190709 周二
    实现功能：(1)CategoryModel分类块展示
    修改文件：(1)redux/components/common/CategoryModel.js

    时间：20190710 周三
    实现功能：(1)DailyProductList产品列表展示功能
    修改文件：(1)redux/components/common/ProductItemModel.js
             (2)redux/components/DailyProductList.js

    时间：20190711 周四
    实现功能：(1)产品列表展示功能,头部模块HeadModel
    修改文件：(1)redux/components/common/ProductItemModel.js
             (2)redux/components/DailyProductList.js
             (3)redux/components/PopularProductList.js
             (4)redux/components/common/HeadModel.js

    时间：20190712 周五
    实现功能：(1)表单功能
    修改文件：(1)redux/components/common/CalculateModel.js

 -->
