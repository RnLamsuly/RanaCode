# LinK35 数的三次方根
[题目链接](http://xmuoj.com/contest/362/problem/LinK35)

## 思路

与上一题思路相同，不过需要注意负数的处理。

## AC代码
```cpp
#include <iostream>
#include <cmath>
#define f(x) ((x)*(x)*(x))
#define ERR 1e-10
 
int main()
{
	//freopen("11.in","r",stdin);
	double l=0,r,input;int s;
	scanf("%lf",&input);
	s=(input>0)?1:-1;input=(input>0)?input:-input;
	r=(input>2)?2:input;
	while(r-l>ERR || l-r>ERR)
	{
		double mid=(l+r)/2.;
		if(f(mid)-input>0) r=mid;
		else l=mid;
	}
	printf("%.6lf",l*s);
	return 0;
}
```