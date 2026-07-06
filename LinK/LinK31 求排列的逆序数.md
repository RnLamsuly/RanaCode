# LinK31 求排列的逆序数
[题目链接](http://xmuoj.com/contest/362/problem/LinK31)

## 思路

求逆序数本质上是对[归并排序](https://oi-wiki.org/basic/merge-sort/)的改造与应用。

每次合并两个数组时，假设左侧数组与右侧数组**内部的逆序数已经统计**，则我们只需要统计两个数组之间的逆序数，即统计**对于右侧每个数**，有多少个**左侧的数**比其**大**。

我们在归并排序中添加相关统计项即可。

---

## 注意

逆序数数量很多，需要使用长整数类型 `long long` 以防止溢出。

---

## AC代码
```cpp
#include <iostream>
using std::min;
const int MAXN=1e5+5;
int a[MAXN];
int L[MAXN],R[MAXN];
long long inv; //inv统计逆序数
 
void merge(int l,int mid,int r)
{
	int n1=mid-l,n2=r-mid;
	for(int i=0;i<n1;++i)L[i]=a[l+i];
	for(int i=0;i<n2;++i)R[i]=a[mid+i];
	int i=0,j=0,pos=l;
	while(i<n1 && j<n2)
	{
		if(L[i]<R[j])
			a[pos++]=L[i++];
		else
		{
			a[pos++]=R[j++];
			inv+=n1-i; //当某个右侧的数被归并时，左侧所有未归并的数都是比其大的逆序数
		}
	}
	while(i<n1)a[pos++]=L[i++];
	while(j<n2)a[pos++]=R[j++];
}
 
void sort(int l,int r)
{
	if(l>=r-1)return;
	int mid=(l+r)/2;
	sort(l,mid);
	sort(mid,r);
	merge(l,mid,r);
}
 
int main()
{
	int n;
	scanf("%d",&n);
	for(int i=0;i<n;++i)scanf("%d",&a[i]);
	sort(0,n);
	printf("%lld",inv);
	return 0;
}
```