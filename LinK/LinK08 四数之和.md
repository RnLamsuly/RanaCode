# LinK08 四数之和
[题目链接](http://xmuoj.com/contest/362/problem/LinK08)

## 思路

双重循环枚举前两个数 + 双指针求解后两个数

---

## AC代码
```cpp
#include <iostream>
#include <iostream>
const int MAXN=1e6;
int a[MAXN];
 
int main()
{
	int target,n;
	std::cin>>target>>n;
	for(int i=0;i<n;++i)
	{
		std::cin>>a[i];
	}
	
	for(int l=0;l<n-3;++l)
	{
		for(int k=l+1;k<n-2;++k)
		{	
			int i=k+1,j=n-1;
			while(i<=j)
			{
				if(a[i]+a[j]+a[k]+a[l]==target&&i<j)std::cout<<a[l]<<' '<<a[k]<<' '<<a[i]<<' '<<a[j]<<'\n';
				if(a[i]+a[j]<=target-a[k]-a[l])i++;
				if(a[i]+a[j]>target-a[k]-a[l])j--;
			}
		}
	}
	return 0;
}
```