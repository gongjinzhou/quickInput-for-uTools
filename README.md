通过输入简短的输入码来方便地输入常用的长文本。进入插件后，可以在输入栏模糊搜索输入码和短语。插件会在输入完成后清空粘贴板内容，为了避免插件数据丢失，请不要开启“隐藏后台时完全退出”功能。

使用方法：
1、输入插件名进入设置，设置常用长文本。
2、聚焦需要输入的输入框后，唤醒utools输入设置好的输入码找到对应项，回车确认完成输入。
3、动态输入功能，您可以在短语中嵌入JavaScript代码来动态生成文本，使用${}包围您的JS代码，例如${return dayjs().format('YYYY-MM-DD'}, 还可以使用saveData和getData方法进行数据的保存与读取。

动态输入功能-使用方法：
- 在短语内容中，使用 ${} 来插入 JavaScript 代码。例如，如果您想插入当前日期，可以编写 ${return dayjs().format('YYYY-MM-DD')}。
- 保存输入项并退出设置。
- 在任何需要输入动态内容的地方，唤醒utools，输入之前设置的输入码，选择对应项，插件将自动计算并输入动态生成的文本。

常用的 dayjs 动态输入搭配：
- 当前日期：${return dayjs().format('YYYY-MM-DD')}
- 当前时间：${return dayjs().format('HH:mm:ss')}
- 当前日期和时间：${return dayjs().format('YYYY-MM-DD HH:mm:ss')}
- 一周开始日期（周一）：${return dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')}
- 月份开始日期：${return dayjs().startOf('month').format('YYYY-MM-DD')}
- 自定义格式化字符串：${return dayjs().format('MMMM D, YYYY h:mm A')}

更具体的格式化方式请查看[dayjs文档](https://dayjs.fenxianglu.cn/category/display.html#%E6%A0%BC%E5%BC%8F%E5%8C%96)

数据保存读取函数使用方式：
${saveData('myKey', 'myValue')}
${return getData('myKey')}}

请享受更加高效的输入体验！

# 部分界面
<img width="627" alt="iShot_2023-05-25_14 58 35" src="https://github.com/gongjinzhou/quickInput-for-uTools/assets/62183759/fa717a01-4646-4683-9680-bb0757ca8cd7">
<img width="624" alt="iShot_2023-05-25_14 58 45" src="https://github.com/gongjinzhou/quickInput-for-uTools/assets/62183759/48841cfe-0ff4-46f6-b809-5eaa40194fb0">
<img width="628" alt="iShot_2023-05-25_14 58 58" src="https://github.com/gongjinzhou/quickInput-for-uTools/assets/62183759/d1fd13be-511a-4ec5-ae99-ede821183922">
