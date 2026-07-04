# LinK02 完美立方
[题目链接](http://xmuoj.com/contest/362/problem/LinK02)

## 思路

对三元组的三个数进行三重循环的枚举，其时间复杂度为 $O(n^3)$，题中给的数据范围较弱，直接进行三重的枚举并不会超时。

---

## 注意

若数据更强，可以直接通过求三次方根求出三元组中的第三个数，将循环降低到两重。由于 `cmath` 库中的 `cbrt()` 函数是硬件指令级实现的，时间复杂度为 $O(1)$，故总时间复杂度降低至 $O(n^2)$。

---

## AC 代码
```cpp
#include<iostream>
#define cube(n) n*n*n
 
void output(int a, int b, int c, int d)// 输出
{
	printf("Cube = %d, Triple = (%d,%d,%d)\n",a,b,c,d);
}
 
void check(int n)// 枚举
{
	for(int i=2;i<=n;++i)
	{
		for(int j=i;j<=n;++j)
		{
			for(int k=j;k<=n;++k)
			{
				if(cube(n) == cube(i) + cube(j) + cube(k))
					output(n,i,j,k);
			}
		}
	}
}
 
int main()
{
	int n;
	scanf("%d",&n);
	for(int i=1;i<=n;++i)check(i);
	return 0;
}
```