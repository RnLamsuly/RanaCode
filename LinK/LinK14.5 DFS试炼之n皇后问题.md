# LinK14.5 DFS试炼之n皇后问题
[题目链接](http://xmuoj.com/contest/362/problem/LinK14.5)

## 思路

思路依旧与前面几题一样，唯一的区别在于要把棋盘的摆法输出。

---

## 注意

一定要注意格式，每两种摆法中间要有一个空行。

---

## AC代码
```cpp
#include<bits/stdc++.h>
using std::string;
using std::cin;
using std::cout;
using std::endl;
int n,flag[15],get[15];
string s;
inline void w()
{
	for(int i=1;i<=n;++i)
	{
		for(int j=1;j<get[i];++j)putchar('.');
		putchar('Q');
		for(int j=get[i]+1;j<=n;++j)putchar('.');
		putchar('\n');
	}
	putchar('\n');
    return;	
} 
inline void dfs(int k)
{
	if(k==n)
	{
		w();
		return;
	}
	for(register int i=1;i<=n;i++)
	{
		if(flag[i])continue;
		int con=0;	
		for(int j=1;j<=k;++j)
		{
			if(k+1-j==i-get[j])
			{
				con=1;
				continue;
			}
			if(j-k-1==i-get[j])
			{
				con=1;
				continue;
			}
		}
		if(con)continue;
		flag[i]=1;
		get[k+1]=i;
		dfs(k+1);
		flag[i]=0;
	}
}
int main()
{
	scanf("%d",&n);
	dfs(0);
	return 0;	
}
```