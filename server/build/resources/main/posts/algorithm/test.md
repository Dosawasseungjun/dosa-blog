# 개념
아래와 같은 dp를 해결하고 싶을 때 어떻게 할까?
$$
\begin{align*}
dp_{i}&= min_{j<i}(dp_{j}+f_{i}\cdot g_{j} +p_i+q_j)
\end{align*}
$$
혹은 같은 논리로
$$
\begin{align*}
dp_{i}&= max_{j<i}(dp_{j}+f_{i}\cdot g_{j}+p_i+q_j)
\end{align*}
$$
이는 dp자체만 보면 $O(N^2)$ 에 해결이 가능하다. 
이걸 $O(N)$ 혹은 $O(N\log N)$에 해결해보자. 

$f_i$를 $x$로 보고 직선을 $y = g[j]*x+dp[j]$로 쓸 수 있다는 점을 이용할 것이다. 
($p_i$는 나중에 상수를 더하듯이 처리하고 $q_j$ 는 y절편에 포함시켜 버릴 수 있다)
# 문제 1
[달리는 게임](https://www.acmicpc.net/problem/11388)
DP식을 다음과 같이 짰다. 
```
dp[i] = i까지 확인했을 때 최대 점수

1) i번째 선택 안했을 때
	dp[i] = dp[i-1]
1) i번째 선택 했을 때 (j+1~i까지 쭉 선택함 : j는 필연적으로 선택 안함 -> 1 <= j < i)
	dp[i] = max(dp[j-1] + 1*a[j+1]+2*a[j+2]+...+(i-j)*a[i])
	= max(dp[j-1] + ps2[i]-ps2[j]-j*(ps[i]-ps[j]))
	y = -j*ps[i] + dp[j-1] + j*ps[j] - ps2[j] + ps2[i]
```
이번엔 다른 문제들과 다르게 단조 감소하는 기울기가 주어지고 최댓값을 구해야한다. 
따라서 덱을 이용해서 앞에서 부터 넣어줘야한다.
또한 x인 ps[i]가 불규칙하게 주어지니까 이분탐색으로 해결해야한다. 

### 코드
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
#define xx first
#define yy second

struct ConvexHullTrick{
    deque<pll> dq;
    int pos = 0;
    double crossPoint(pll line1, pll line2){
        return 1.0 * (line1.yy-line2.yy) / (line2.xx- line1.xx);
    }
    void insert(pll A, int line_idx){
        while((int)dq.size() > 1){
            pll B = dq.front();
            dq.pop_front();
            pll C = dq.front();
            
            if(crossPoint(C, B)>crossPoint(B, A)){
                dq.push_front(B);
                break;
            }
        }
        dq.push_front(A);
    }
    ll binary_query(ll x){
        ll l = 0, r = dq.size();
        while(l+1<r){
            ll mid = (l+r)>>1;
            if(crossPoint(dq[mid-1], dq[mid])<=x) l = mid;
            else r = mid;
        }
        return dq[l].xx*x+dq[l].yy;
    }
}CHT;

int main() {
    fast_io
    ll n; cin >> n;
    vector<ll> a(n+1), dp(n+2), ps(n+1), ps2(n+1);
    for(ll i=1;i<=n;i++){
        cin >> a[i];
        ps[i] = ps[i-1] + a[i];
        ps2[i] = ps2[i-1] + i*a[i];
    }
    //dp[i] = i까지 확인했을 때 최대 점수
    /* 
    1) i번째 선택 안했을 때
        dp[i] = dp[i-1]  
    2) i번째 선택 했을 때 (j+1~i까지 쭉 선택함 : j는 필연적으로 선택 안함 -> 1 <= j < i)
        dp[i] = max(dp[j-1] + 1*a[j+1]+2*a[j+2]+...+(i-j)*a[i]) 
              = max(dp[j-1] + ps2[i]-ps2[j]-j*(ps[i]-ps[j]))
            y = -j*ps[i] + dp[j-1] + j*ps[j] - ps2[j] + ps2[i] 
    */
   dp[0] = 0;
   dp[1] = max(dp[0], a[1]);
   CHT.insert({0, 0}, 0);
   CHT.insert({-1, dp[0]}, 1);
   for(ll i=2;i<=n;i++){
        ll X = CHT.binary_query(ps[i]);
        CHT.insert({-i, dp[i - 1] + i * ps[i] - ps2[i]}, 2);
        dp[i] = max(dp[i-1], X + ps2[i]);
   }
   cout << dp[n];
}
```

1. long long 형을 쓸거면 for문에서도 long long 쓰는 습관을 들일 것
2. stk인 코드에서 dq으로 바꿀 때 pop_front() 통일성있게 다 바꿨어야 했는데 바보 같이 함;;

핵심은 x값으로 할 i관련된 식은 CHT에 넣지 않고 j관련된 식은 전부 넣는 것 그것이 핵심이다. 

# 문제 2 : 조명등
[조명등](https://www.acmicpc.net/problem/19943)
DP식을 짜보자. 

```
dp[i] : i번째 작품까지 커버하는 조명등 설치 최소 비용
dp[i] = min(dp[j] + cost(j+1, i))
cost(j+1, i) : j+1~i까지를 모두 커버하는 최소 조명등 설치 비용
			= j+1에서 기울기 1로 뻗어나간 직선과 i에서 기울기 -1로 뻗어나가는 직선의 교점의                  y좌표의 제곱
```
근데 이렇게만 정의하면 j와 i사이에 커버되지 못하는 점이 생길 수 있다. 
이를 대비하여 어짜피 다른 점에 의해 커버가 되는 점은 아예 제외를 해버리면 된다. 
![[Pasted image 20241219155828.png]]
위의 그림 중 첫번째는 두 점 모두 제외하면 안되는 경우다. 
두번째는 P2는 의미가 없다. 어짜피 P1커버할 때 덮이기 때문이다. 
세번째는 P1이 의미가 없다. 어짜피 P2커버할 때 덮이기 때문이다. 
이런 방법으로 애초에 엇나가는 점을 다 지우고 시작한다. 

그럼 이제 다시 dp식을 더 자세하게 써보겠다. 
$$
\begin{align*}
dp[i] &= dp[j] + cross(j+1, i)_{y}^{2}\\
&= dp[j]+(\frac{P[j+1].y-P[j+1].x+P[i].x+P[i].y}{2})^{2}
\end{align*}
$$
식이 2차식이 들어가서 복잡하다.. 기울기와 y절편을 잘 설정해보자. 
일단 $dp[i]$에 4를 곱한 값을 생각해서 마지막에 4를 나눠주도록 하고
$$
\begin{align*}
dp[i]&=dp[j]+(P[j+1].y-P[j+1].x)^{2}+(P[i].x+P[i].y)^{2}+2(P[j+1].y-P[j+1].x)(P[i].x+P[i].y)\\
p[i] &= (P[i].x+P[i].y)^{2}\\
q[j]&= (P[j+1].y-P[j+1].x)^{2}\\
\\
y &= 2(P[i].x+P[i].y)(P[j+1].y-P[j+1].x)+dp[j]+p[i]+q[j]
\end{align*}
$$
꼴로 정리 할 수 있다. 
일단 기울기를 $2(P[j+1].y-P[j+1].x)$로 정한것이기 때문에  j가 증가함에 따라 $P[j+1].y-
P[j+1].x$가 단조성이 있어야한다. 
교점의 좌표를 $(x_c, y_c)$ 로 두면, 앞의 점은 $(x_c-\alpha, y_c-\alpha)$, 뒤의 점은 $(x_c+\beta, y_c-\beta)$가 된다. 
이를 토대로 기울기가 단조감소하는 걸 확인할 수 있다. 
(단, $\alpha, \beta \geq0$)

여기서 $P[i].x+P[i].y$도 단조증가한다. 따라서 문제를 $O(N)$에 해결 가능하다.
교점의 좌표를 $(x_c, y_c)$ 로 두면, 앞의 점은 $(x_c-\alpha, y_c-\alpha)$, 뒤의 점은 $(x_c+\beta, y_c-\beta)$가 된다. 
(단, $\alpha, \beta \geq0$)
교점의 합을 고려하면 당연하게도 뒤의 점이 클 수 밖에 없다. 
덱 앞에서 부터 보면서 안쓰는 점은 버려버리면 된다. 

