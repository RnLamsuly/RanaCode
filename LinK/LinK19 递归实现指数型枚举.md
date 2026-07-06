# LinK19 递归实现指数型枚举
[题目链接](http://xmuoj.com/contest/362/problem/LinK19)

## 思路

这题的名字已经告诉我们使用**递归**可以解决。思路是每层递归枚举某个数字**拿**与**不拿**的两种情况。

这里提供一种不一样的思路：

我们可以用一个数字的二进制位来对应拿取数字的方案。给定一个数字，若其第 $i$ 二进制位上的数是 $1$ 则代表拿取数字 $i+1$ ，否则则代表不拿(我们规定二进制位从右往左标记，从 $0$ 开始)。这样从 $0$ 至 $2^n-1$ 个数就能代表所有的 $2^n$ 种拿去情况。枚举这些数字即枚举方案。

---

## 注意

考虑到数字要从大到小输出，而我们枚举二进制位的时候需要从低位枚举，我们用栈实现逆序输出。

---

## AC代码
```cpp
#include <iostream>
#include <stack>
using std::stack;
stack<int> ans;
int main()
{
	int n;
	scanf("%d",&n);
	for(int i=0;i<1<<n;++i) //枚举方案对应的数
	{
		int t=i;
		for(int j=n;t;t>>=1,--j) //枚举每一位对应的拿取情况
			if(t&1)ans.push(j); //如果为1则代表拿取 
		while(!ans.empty()) //逆序输出
		{
			printf("%d ",ans.top());
			ans.pop();
		}
		putchar('\n');
	}
	return 0;
}
```