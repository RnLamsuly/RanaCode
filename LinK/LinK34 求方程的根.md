# LinK34 求方程的根
[题目链接](http://xmuoj.com/contest/362/problem/LinK34)

## 思路

本题是典型的在连续区间上进行[二分查找](https://oi-wiki.org/basic/binary/)的例子。我们需要选择起始区间，该区间必须选择**包含结果的单调区间**。然后进行二分查找，直到待查询区间**小于允许误差范围**。

---

## AC代码
```cpp
#include <iostream>
#define f(x) x*x*x-5*x*x+10*x-80
#define ERR 1e-10 //精确到小数点后9位，所以我们选择误差范围1e-10
 
int main()
{
	double l=0,r=10; //包含结果的单调区间
	while(r-l>ERR)
	{
		double mid=(l+r)/2.;
		if(f(mid)>0) r=mid;
		else l=mid;
	}
	printf("%.9f",l);
	return 0;
}
```