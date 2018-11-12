# JSON Data Format Definition

## 联系人

```javascript
contact = {
    "name": "张三",
    "type": "同事",
    "tel": "13913132424",
    "email": "11@qq.com",
    "weibo": "zhjj",
    "zhihu": "zhjj",
    "douban": "zhjj"
};
```

| 属性   | 含义           | 取值   |
| ------ | -------------- | ------ |
| name   | 联系人姓名     | string |
| type   | 联系人分组     | string |
| tel    | 联系人电话号码 | string |
| email  | 联系人邮箱     | string |
| weibo  | 联系人微博账户 | string |
| zhihu  | 联系人知乎账户 | string |
| douban | 联系人豆瓣账户 | string |

* 适用场景：增加联系人



## 联系人邮箱新邮件

``` javascript
emailInfo = {
    "email": "11@qq.com",
    "message": "周末一起吃个饭吧。“
};
```

| 属性    | 含义                 | 取值   |
| ------- | -------------------- | ------ |
| email   | 联系人邮箱           | string |
| message | 联系人邮箱新邮件内容 | string |

* 适用场景：更新联系人邮箱新发送给自己的信息



## 联系人社交平台新动态

``` javascript
mediaInfo = {
    "weibo": "zhjj",
    "weiboInfo": {
        "1": "早上好",
        "2": "下午好",
        "3": "晚上好"
    },
    "zhihu": "zhjj",
    "zhihuInfo": {
        "1": "早上好",
        "2": "下午好",
        "3": "晚上好"
    },
    "douban": "zhjj",
    "doubanInfo": {
        "1": "早上好",
        "2": "下午好",
        "3": "晚上好"
    }
};
```

| 属性       | 含义               | 取值     |
| ---------- | ------------------ | -------- |
| weibo      | 联系人微博账户     | string   |
| weiboInfo  | 联系人微博最新动态 | JSON对象 |
| zhihu      | 联系人知乎账户     | string   |
| zhihuInfo  | 联系人知乎最新动态 | JSON对象 |
| douban     | 联系人豆瓣账户     | string   |
| doubanInfo | 联系人豆瓣最新动态 | JSON对象 |

适用场景：更新联系人社交平台新动态