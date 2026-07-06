# LinK18 2的幂次方表示
[题目链接](http://xmuoj.com/contest/362/problem/LinK18)

## 思路

从题目描述中我们就不难看出这道题应该使用**递归**解决，因为题中对幂次方表示的定义就是**递归定义**。

终止条件有两个：

- $ 1 = 2^0$
- $ 2 = 2 $

其余情况，我们每次先输出 `2(` ，然后进行递归，最后补全括号 `)` 即可。

---

## 注意

拆分二次幂的时候应该从高位到低位进行，且相邻两项用加号连接。

---

## AC代码
```cpp
#include <iostream>
using std::cin;
 
 
void trans(int n)
{
	bool flag=0;
	for(int i=16;i>=0;i--)
	{
		int t=1<<i; //i和t搭配，从高位往低位进行循环
		if(!(t&n))continue; //判断n的第 i 二进制位上是否为1
		if(flag)putchar('+'); //如果不是第一项，则在此项前补充加号
		flag=1;
		if(i==0) //终止条件之一，下同
		{
			printf("2(0)");
			continue; 
		}
		if(i==1)
		{
			printf("2");
			continue; 
		}
		printf("2(");
		trans(i); //递归
		printf(")");
	}
}
 
int main()
{
	int n;
	cin>>n;
	trans(n);
	return 0;
}
```