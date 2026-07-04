# LinK07 三数之和
[题目链接](http://xmuoj.com/contest/362/problem/LinK07)

## 思路

相比两数之和，这一题多了一个数。我们依旧可以使用双指针：枚举第一个数，用双指针确定第二、三个数。

时间复杂度为 $O(n^2)$。

---

## 注意

题目中没有说明给出的数列按照升序排列，理论上应当先对数列进行排序。但测试发现本题数据点给出的均为升序列，可能是继承了上一题的条件。

多解，要求按升序排列，所以我们应当先从小到大枚举第一个数，再用双指针查找第二、三个数。

---

## AC 代码
```cpp
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
	
	for(int k=0;k<n-2;++k) //枚举第一个数。注意这里循环到n-3，要为后面的数留出两个位置
	{	
		int i=k+1,j=n-1;
		while(i<=j) //双指针求解
		{
			if(a[i]+a[j]+a[k]==target&&i<j)std::cout<<a[k]<<' '<<a[i]<<' '<<a[j]<<'\n';
			if(a[i]+a[j]<=target-a[k])i++;
			if(a[i]+a[j]>target-a[k])j--;
		}
	}
	return 0;
}
```