# LinK32 查找指定数
[题目链接](http://xmuoj.com/contest/362/problem/LinK32)

*本题测试点给出的数列均是按升序排列的，但题面似乎未说明*

## 二分查找

**[二分查找](https://oi-wiki.org/basic/binary/)**：一种快速查找出有序数列中给定数对应下标的算法。

其核心思想是：

对于一个**升序列**
1. 每次选择数列中正中间一项( $mid$ )。
2. 如果 $mid$ 就是查找目标，则直接返回结果。
3. 如果 $mid$ 比目标值要大，则目标值一定在 $mid$ 左侧，对其左侧进行二分查找。
4. 如果 $mid$ 比目标值要小，则目标值一定在 $mid$ 右侧，对其右侧进行二分查找。

二分查找每次查询可以排除掉**剩余项的一半**，故其平均[时间复杂度](https://oi-wiki.org/basic/complexity/)与最坏时间复杂度均为 $O(log n)$ 。

---

## 具体实现

我们用 $l$ 和 $r$ 分别代表待查找区间的左端点和右端点。

初始的时候待查找区间就是整个区间。每次查找令 $mid = \dfrac{l+r}2$ 。若答案在 $mid$ 左侧，则将 $r$ 更新为 $mid$ ，反之则更新 $l$ 为 $mid$ 。

当区间缩小到小于误差范围，或得到结果后直接结束循环。

---

## 注意

对离散序列进行二分查找时，一定要想清楚查找的区间**哪边是开区间，哪边是闭区间**。否则查找过程中下标会出现错误。

---

## AC代码
```cpp
#include <iostream>
using std::min;
const int MAXN=1e5+5;
int a[MAXN];
int n;
 
int search(int t)
{
	int l=0,r=n,mid; //初始查找区间为[0,n)
	while(l<r-1) //区间[l,r)元素大于一个则需要继续查找
	{
		mid=(l+r)/2; //中间值
        if(a[mid]==t)return mid; //获得结果直接返回
		if(t<a[mid])r=mid; //根据中间值进行区间划分
		else l=mid;
	}
	if(a[l]==t)return l; //判断最终区间的结果是否为查找的结果
	return -1; //不是目标则返回-1
}
 
int main()
{
	scanf("%d",&n);
	for(int i=0;i<n;++i)scanf("%d",&a[i]);
	int t;
	scanf("%d",&t);
	while(t--)
	{
		int tar;
		scanf("%d",&tar);
		printf("%d\n",search(tar));
	}
	return 0;
}
```