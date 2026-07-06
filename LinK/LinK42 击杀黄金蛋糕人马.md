# LinK42 击杀黄金蛋糕人马
[题目链接](http://xmuoj.com/contest/362/problem/LinK42)

## 思路

本题考查的是**递归 + 二分答案** 。

检查答案 $X$ 是否成立时，对于每种尺寸的蛋糕，如果要分成 $m$ 块，我们都可以简单地枚举切一刀的方案 (仅切一刀的方案数应该是 $w+h+2$ )。对于每种方案，我们会将蛋糕分成两个部分。两个部分总共要分出 $m$ 块，所以我们进一步枚举每一边应该分出多少块。所有方案中如果有方案能够成立，则能够成立。

此外，我们可以用**记忆化搜索**优化效率。

---

## AC代码
```cpp
#include <iostream>
#include <cstring>
 
const int MAXN = 25;
int memory[MAXN][MAXN][MAXN];
int X;
 
bool check(int w, int h, int m)
{
    if (w > h) return check(h, w, m); //依据对称性剪枝
    if (memory[w][h][m] != -1)return memory[w][h][m] == 1; //记忆化搜索
    if (m == 1)return w * h <= X; //当只剩一块的时候，判断剩余面积是否小于待检查的答案即可
    if (w == 1 && h == 1)return false; //面积只剩1了，无法继续分了
    if (w * h < m)return false; //不够切的情况
    if (w * h == m)return X >= 1; //刚好分成面积为1的小块
    if (w * h > m * X)return false; //可行性剪枝
 
    for (int i = 1; i <= w / 2; ++i) // 枚举竖切
        for (int j = 1; j < m; ++j)
            if ((check(i, h, j) && check(w - i, h, m - j)) || (i != w - i && check(w - i, h, j) && check(i, h, m - j)))
            {
                memory[w][h][m] = 1;
                return true;
            }
 
    for (int i = 1; i <= h / 2; ++i) // 枚举横切
        for (int j = 1; j < m; ++j)
            if ((check(w, i, j) && check(w, h - i, m - j)) || (i != h - i && check(w, h - i, j) && check(w, i, m - j)))
            {
                memory[w][h][m] = 1;
                return true;
            }
 
    memory[w][h][m] = 0;
    return false;
}
 
int main()
{
    int w,h,m;
    while (1)
    {
        scanf("%d%d%d",&w,&h,&m);
        if (!(w|h|m)) break;
        int l=(w*h + m - 1) / m;
        int r=w*h;
        while (l <= r) //二分答案
        {
            int mid = (l + r) / 2;
            X=mid;
            memset(memory,-1,sizeof(memory));
            if (check(w, h, m)) r=mid-1;
            else l=mid+1;
        }
        printf("%d\n", l);
    }
    return 0;
}
```