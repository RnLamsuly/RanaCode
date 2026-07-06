# LinK41 英杰们的蛋糕塔
[题目链接](http://xmuoj.com/contest/362/problem/LinK41)

## 思路

本题考查的是[DFS](https://oi-wiki.org/search/dfs/)。

由于数据较强，我们必须加上[剪枝](https://oi-wiki.org/search/opt/#%E5%89%AA%E6%9E%9D%E6%96%B9%E6%B3%95)优化，否则会TLE。

我们从底层到顶层，枚举当前层蛋糕可行的半径与高，然后记录其中的最小表面积。

---

## 注意

本题有三个关键的剪枝，缺一不可：

### 1. 体积可行性剪枝

`if (leftV + minv[layer] > v) return;`

作用：如果已用体积 + 剩余层数的最小体积 > 总体积，则剪枝。

原理：`minv[layer] = 1^3 + 2^3 + ... + layer^3` ，是剩余 layer 层的最小可能体积。

### 2. 最优性剪枝

`if (s + mins[layer] >= ans) return;`

作用：如果当前表面积 + 剩余层数的最小表面积 >= 当前最优解，则剪枝。

原理：`mins[layer] = 2*1^2 + 2*2^2 + ... + 2*layer^2` ，是剩余 layer 层的最小侧面积。

### 3. 体积-表面积不等式剪枝（最强）

`if (s + 2 * (v - leftV) / R >= ans) return;`

作用：利用体积与表面积的不等式关系，估算剩余体积的最小表面积下界。

数学推导：

设剩余体积为 $V_{rem} = v - leftV$，剩余部分的侧面积为 $S_{rem}$。

对于剩余的每一层，有：

$$V_{rem} = \sum_{i=1}^{layer} r_i^2 \cdot h_i$$

$$S_{rem} = \sum_{i=1}^{layer} 2 \cdot r_i \cdot h_i$$

由于当前层半径 $R$ 是剩余层的半径上界，即 $r_i \le R$，因此：

$$V_{rem} = \sum r_i^2 \cdot h_i \le R \cdot \sum r_i \cdot h_i$$

移项得：

$$\sum r_i \cdot h_i \ge \frac{V_{rem}}{R}$$

所以：

$$S_{rem} = 2 \cdot \sum r_i \cdot h_i \ge \frac{2 \cdot V_{rem}}{R}$$

即剩余侧面积至少为 $2 \cdot (v - leftV) / R$。


---

## AC代码
```cpp
#include <iostream>
#include <string.h>
#include <cmath>
using std::min;
 
int v,n;
int ans=0x7fffffff;
int minv[25],mins[25]; //分别为剩余i层最小的体积和表面积
 
void initialize() //用于初始化minv与mins
{
    int sumv=0,sums=0;
    for(int i=1;i<25;++i)
    {
        sumv+=i*i*i;
        sums+=2*i*i;
        minv[i]=sumv;
        mins[i]=sums;
    }
}

//layer为剩余层数, leftV为剩余体积, s为当前表面积, R为上一层半径, H为上一层高度
void dfs(int layer, int leftV, int s, int R, int H)
{
    //三个关键剪枝
    if (leftV + minv[layer] > v) return;
    if (s + mins[layer] >= ans) return;
    if (s + 2 * (v - leftV) / R >= ans) return;
 
    if (!layer) //剩余层为0，即蛋糕已完成
    {
        if (leftV == v) ans = s;
        return;
    }
 
    for (int r = min(R - 1, (int)sqrt(v - leftV)); r >= layer; r -- ) //注意循环起始条件，这也是优化的一部分
        for (int h = min(H - 1, (v - leftV) / r / r); h >= layer; h -- )
        {
            int t = 0;
            if (layer == n) t = r * r;
            dfs(layer - 1, leftV + r * r * h, s + 2 * r * h + t, r, h);
        }
}
 
int main()
{
    scanf("%d%d", &v, &n);
    
    initialize();
 
    dfs(n, 0, 0, 0x7fffffff, 0x7fffffff);
 
    if (ans == 0x7fffffff) ans = 0;
    printf("%d", ans);
    return 0;
}
```