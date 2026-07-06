# LinK37 林克的蛋糕
[题目链接](http://xmuoj.com/contest/362/problem/LinK37)

## 思路

本题依旧是**二分答案**，不过是连续区间上的二分答案。

分蛋糕的时候使用贪心算法，根据指定体积，将每块蛋糕分出尽可能多份。

---

## 注意

朋友数不包括林克本人。所以人数应为输入人数加 $1$ 。

---

## AC代码
```cpp
#include <iostream>
#define int long long 
int m,n;
const int MAXN=1e5+5;
const double PI=3.141592653589793,ERR=1e-6;
double a[MAXN],temp[MAXN];
 
bool check(double x)
{
    int cnt = 0; //统计总共能分出的蛋糕数量
    for (int i = 0; i < n; ++i)
    {
        cnt += (int)(a[i] / x);
        if (cnt >= m) return true; //已达到m则直接判为满足条件
    }
    return cnt >= m;
}
 
signed main()
{
	scanf("%lld%lld",&n,&m);
	m+=1;
	double l=0,r=0;
	for(int i=0;i<n;++i)
	{
		scanf("%lf",&a[i]);
		a[i]*=a[i];
		r=std::max(a[i],r);
	}
	while(r-l>ERR) //连续区间的二分
	{
		double mid=(l+r)/2;
		if(check(mid))l=mid;
		else r=mid;
	}
	printf("%.3lf",l*PI);
	return 0;
	
}
```