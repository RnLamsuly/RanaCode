# LinK13 输出N皇后的全部摆法
[题目链接](http://xmuoj.com/contest/362/problem/LinK13)

## 思路

皇后在国际象棋中有三种走法：横着走、竖着走以及斜着走。

先考虑皇后竖着走的性质。如果我们要在 $n \times n$ 的棋盘上放下 $n$ 个皇后，那么我们每一列都只能放置有且仅有 $1$ 个皇后。基于这个性质，我们可以使用一个数组 $a$ 来存储棋盘的信息，其**索引**代表**列**，其**值**代表该列上皇后所处的**行**。

然后我们再考虑第二、三个性质：

- 皇后能横着走，即不允许在同一行出现两个皇后。用数学语言描述就是： 
$$\forall i\not = j ,a_i \not = a_j$$ 

- 皇后能斜着走，即不允许在同一斜线上出现两个皇后。考虑到处于同一斜线的两颗棋子，其**行坐标的差与列坐标的差相等**。用数学语言描述就是： 
$$\forall i\not = j ,|a_i - a_j| \not =  |i - j| $$

我们将上述的两个限制作为DFS回溯的剪枝条件即可。

---

## AC 代码

```cpp
#include<bits/stdc++.h>
using std::string;
using std::cin;
using std::cout;
using std::endl;
int n,flag[15],get[15];
string s;
void output()
{
	for(int i=1;i<=n;i++) printf("%d",get[i]);
	cout<<endl;
    return;	
} 
void dfs(int k)
{
	if(k==n)
	{
		output();
		return;
	}
	for(int i=1;i<=n;i++)
	{
		if(flag[i])continue; //若这一行已放置了旗子，则跳过
		int con=0;	
		for(int j=1;j<=k;++j) //与已放置的旗子依次比较，判断是否位于同一斜线
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