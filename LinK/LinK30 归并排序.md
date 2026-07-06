# LinK30 归并排序
[题目链接](http://xmuoj.com/contest/362/problem/LinK30)

**[归并排序](https://oi-wiki.org/basic/merge-sort/)**：与[快速排序](https://oi-wiki.org/basic/quick-sort/)类似，归并排序同样采用**分治**思想。但两种排序的主要过程却截然不同。快速排序中排序的操作主要在"分"中进行，而归并排序中主要在"合"中进行。

归并排序的[时间复杂度](https://oi-wiki.org/basic/complexity/)为 $O(n \log n)$。

---

## 核心思想

1. 将数组从中间分成两半
2. 递归排序左半部分和右半部分 ( 时间复杂度 $O(\log n)$ )
3. 将两个有序子数组合并为一个有序数组 ( 时间复杂度 $O(n)$ )

---

## AC代码
```cpp
#include <iostream>
using std::min;
const int MAXN=1e5+5;
int a[MAXN];
int L[MAXN],R[MAXN];
 
void merge(int l,int mid,int r)
{
	int n1=mid-l,n2=r-mid;
	for(int i=0;i<n1;++i)L[i]=a[l+i];
	for(int i=0;i<n2;++i)R[i]=a[mid+i];
	int i=0,j=0,pos=l;
	while(i<n1 && j<n2) //每次从两个有序数组未选数字的最小值中选择更小的一个
	{
		if(L[i]<R[j])
			a[pos++]=L[i++];
		else
			a[pos++]=R[j++];
	} 
    //将剩余的数全部归入
	while(i<n1)a[pos++]=L[i++];
	while(j<n2)a[pos++]=R[j++];
}
 
void sort(int l,int r)
{
	if(l>=r-1)return; //只有一个数的时候递归终止
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
	for(int i=0;i<n;++i)printf("%d ",a[i]);
	return 0;
}
```