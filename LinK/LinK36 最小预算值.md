# LinK36 最小预算值
[题目链接](http://xmuoj.com/contest/362/problem/LinK36)

## 二分答案

当某类问题存在临界值时(即某参数小于某值时成立，而大于某值则不会成立)，我们可以使用二分的思想来查找这个临界值。这个过程称为**二分答案**。

顾名思义，二分答案就是对可能的答案进行**二分**。二分答案有两个重要部分：

1. 二分。我们依旧需要每次把区间分为两半，然后根据中点的性质来取舍区间。
2. 检查。我们每次需要把中点带入题目中检查起是否成立。

## 本题思路

显然，如果预算为 $mid$ 时**能**够满足条件，那么预算小于 $mid$ 时也一定**能**满足条件；反之，若预算为 $mid$ 时**不能**满足条件，那么预算大于 $mid$ 时也一定**不能**满足条件。所以这个问题存在临界值，二分答案是可行的。

---

## 具体实现

由于预算一定不低于任意一天的预算，且不高于所有组预算之和。所以我们先取初始区间 $[\min\{a_i\},\sum a_i]$

然后我们每次取中点判断起能否满足要求，如果满足则将待查询区间的右端点更新为中点，否则将左端点更新为中点，直到查询到临界值。

---

## AC代码
```cpp
#include <iostream>
#define int long long 
int m,n;
const int MAXN=1e5+5;
int a[MAXN];
 
bool check(int x) //检查函数，使用贪心算法检验是否满足要求
{
    int cnt = m; //cnt为剩余可分组数量
    int sum = 0; //sum为当前分组预算总和
    for (int i = 0; i < n; ++i)
    {
        if (a[i] > x) return false; //单日超过预算直接判定为不满足，不过在给定初始区间下不会出现该情况
        if (sum + a[i] > x)
        {
            cnt--; 
            sum = a[i];   
            if (cnt < 0) return false;
        }
        else
        {
            sum += a[i];
        }
    }
    if (sum > 0) cnt--; //单独处理最后一组
    return cnt >= 0;
}
 
signed main()
{
	scanf("%lld%lld",&n,&m);
	int l=0,r=0;
	for(int i=0;i<n;++i)
	{
		scanf("%lld",&a[i]);
		r+=a[i];
		l=std::max(a[i],l);
	}
	while(l<r) //二分
	{
		int mid=(l+r)/2;
		if(!check(mid))l=mid+1;
		else r=mid;
	}
	printf("%lld",l);
	return 0;
	
}
```