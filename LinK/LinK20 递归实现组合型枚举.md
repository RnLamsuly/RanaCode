# LinK20 递归实现组合型枚举
[题目链接](http://xmuoj.com/contest/362/problem/LinK20)

## 思路

本题本质上还是排列数字的变式，区别有二：

1. 不再是全排列，改为从全部数字中选择部分。
2. 不再是排列，改为组合，要求升序。

我们只要修改递归的终止层数，然后循环枚举时从上一层的数字起始以保证升序，即可符合要求。

---

## AC代码
```cpp
#include <iostream>
int com[60];
int n,m;
 
void output()
{
	for(int i=0;i<m;++i)printf("%d ",com[i]);
	putchar('\n');
}
 
//参数x表示递归层数，也是数组中待定数的索引
//参数y表示循环枚举的起始值
void C(int x,int y)
{
	if(x==m)
	{
		output();
		return;
	}
	for(int i=y;i<=n;++i)
	{
		com[x]=i;
		C(x+1,i+1); //下一层循环起始值为i+1，保证升序
		com[x]=0;
	}
}
 
int main()
{
	scanf("%d%d",&n,&m);
	C(0,1);
	return 0;
}
```