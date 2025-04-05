# 목적과 조건

## 목적

>$O(KN^2)$ 의 알고리즘을 $O(KNlogN)$으로 시간복잡도를 줄이기 위함

## 조건

### 1. DP 점화식
$dp[i][j] = min_{k<i}(dp[i-1][k] + C[k][j])$ 
### 2. C의 조건
$C[i][j]$ 는 Monge array이거나 최적해의 단조성이 있어야한다. 
#### Monge array
$C[a][b] + C[b][d] \leq C[a][d] + C[b][c]$  인 배열이라는 뜻이다.
$C[i][j]$ 를 $i, j$  사이에서의 비용이라고 하면 구간을 포함하면 더 비싼 배열이라고 보면 된다.
(최솟값인지 최댓값인지에 따라 부등호 방향이 바뀜)
최적해의 단조성은 임의의 $c < d$ 에 대해
$dp[i-1][k] + C[k][c]$ 를 최소화하는 k를 $k_c$
$dp[i-1][k] + C[k][d]$ 를 최소화하는 k를 $k_d$ 라고 하면
$k_{c}<k_{d}$ 가 되는 것을 말한다. 

이분탐색도 단조성이 있기 때문에 $O(N)$에서 $O(logN)$ 으로 줄일 수 있듯이
단조성이 있기 때문에 탐색범위를 줄일 수 있는 것이다. 

### 예제 1
[11001 김치](https://www.acmicpc.net/problem/11001) 
이 문제를 분석하면서 어떨 때 이 최적화를 쓸 수 있는지 확인해보자. 

>김치의 맛의 가치를 구하는 문제이다. 
	김치의 맛의 식은 다음과 같다. 
	$taste = time * temp + val_{ori}$  
	맛은 숙성시간 * 온도 + 원래 가치로 정의 된다. 
	$time = (꺼낸날 - 넣은날)$ 
	$temp_{i} \geq temp_{i+1}$ 온도는 점점 내려간다. 

- 점화식 짜기
$dp[i]$ : i번째 날에 최대 김치 가치
$dp[i] = max_{\substack{i-D \leq j \leq i}}{(i-j)t_{i}+ v_j}$ 

### 구현1
[D&C를 이용한 최적화 구현](https://cp-algorithms.com/dynamic_programming/divide-and-conquer-dp.html)
기본적인 틀은 위의 링크와 같다.
그럼 이것을 이용해서 김치를 풀어보겠다.
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

const int MAX = 1e5+1;
ll m, n, d, T[MAX], V[MAX];
vector<ll> dp_cur;

ll C(ll i, ll j){
    return (j - i) * T[j] + V[i];
}

void compute(ll l, ll r, ll optl, ll optr){
    if(l > r) return ;

    ll mid = (l + r) >> 1;
    pll best = {LLONG_MIN, -1};
    for(ll k=max(optl, mid-d);k<=min(mid, optr);k++){
        best = max(best, {C(k, mid), k});
    }
    dp_cur[mid] = best.xx;
    int opt = best.yy;

    compute(l, mid-1, optl, opt);
    compute(mid+1, r, opt, optr);
}

ll solve(){
    dp_cur.assign(n, 0);
    for(int i=0;i<m;i++){
        compute(0, n-1, 0, n-1);
    }
    return *max_element(dp_cur.begin(), dp_cur.end());
}

int main(){
    fast_io
    m = 1;
    cin >> n >> d;
    for(int i=0;i<n;i++) cin >> T[i];
    for (int i = 0; i < n; i++) cin >> V[i];
    ll res = solve();
    cout << res;
}
```
이 문제는 dp식을 한번만 구하면 된다. 
사실 dp배열도 필요없고 최댓값만 구하면 되긴한다. 
핵심은 $N \times D$ 의 경우를 모두 계산하는게 아니라 $D \times \log N$  만큼만 계산하는 것이다.
$O(N\log N)$ 이라고 표현할 수 있을 것이다.

### 예제 2 
[18444 우체국 3](https://www.acmicpc.net/problem/18444)
각 마을이 **원형**으로 V개 존재하고 V개의 마을 중 P곳에 우체국을 지으려고 한다. 
이 때 우체국과 **각 마을 사이의 거리의 합이 최소가 되도록하는 우체국 위치를 모두 구하는 문제**다.
거리는 다음과 같은 식으로 구한다.
$$
C(x, y) = min(|y -x|, L - |y-x|)
$$
이 때 L은 마을 둘레의 길이다.
$$
\begin{align*}
1 \leq P \leq V \leq 250\\
1 \leq L \leq 1e12
\end{align*}
$$

일단, 원형을 선형으로 바꿔서 풀기 위해 $2 \times V$ 짜리 배열을 만든다.
### cost 전처리
그리고 Cost를 $O(V^3)$ 으로 전처리 해둔다.
그럼 $C[i][j]$ 의 배열이 뜻하는 것은 , i ~ j까지 우체국 하나를 썼을 때 드는 최소 비용이 된다.
최소 비용은 i ~ j의 중간에 있는 것이 무조건 최적의 값이 되기 때문에 cost의 전처리가 가능한 것이다.
```cpp
// cost 전처리
for(int i=1;i<=2*V;i++){
	for(int j=i;j<=2*V;j++){
		int mid = (i + j) >> 1;
		for(int k=i;k<=j;k++) {
			C[i][j] += abs(pos[k] - pos[mid]);
		}
	}
}
```
$1$ ~ $V$ , $2$ ~ $V + 1$, $\cdots$  , $V$ ~ $2V$
의 경우의 dp식을 업데이트 해줄 것이다. 
### dp 식
```txt
dp[i][j] = 시작점부터 i까지 우체국을 j개 설치했을 때 최소 비용
```
이렇게 해두면
$$
\begin{align*}
dp(i, j) &= dp(k, j-1) + C(k+1, i) (k<i )\\
\end{align*}
$$
이렇게 볼 수 있다. 
### 최적화
i보다 작은 모든 k에 대해 검사하면 dp짜는데만 $O(N^2)$ 이다.
이를 최적화 해서 k값을 검사하는 것을 $O(N\log N)$ 에 할 수 있게 되는 것이다.
### 구현 2
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

const int MAX = 501;
const ll INF = 1e18+1;
ll V, P, L, pos[MAX], C[MAX][MAX];
vector<vector<ll>> dp, recon;
pair<ll, vector<ll>> res;

void dnc(ll x, int l, int r, int optl, int optr){
    if(l > r) return ;

    int mid = (l+r) >> 1;
    int opt = 1;
    dp[mid][x] = INF;
    for(int k = optl ; k < min(mid, optr+1);k++){
        if (dp[mid][x] > dp[k][x - 1] + C[k+1][mid]){
            dp[mid][x] = dp[k][x - 1] + C[k+1][mid];
            opt = k;
            recon[mid][x] = k ;
        }
            
    }

    dnc(x, l, mid - 1, optl, opt);
    dnc(x, mid + 1, r, opt, optr);
}

void reconstruct(int c, int i, int j){
    if(!j){
        return ;
    }
    ll posi = pos[(i +recon[i][j] + 1) >> 1];
    if(posi > L) posi -= L;
    res.yy.push_back(posi);
    reconstruct(c, recon[i][j], j-1);
}

void solve(int cnt){
    dp.assign(2*V+1, vector<ll>(2*V+1, 0));
    recon.assign(2*V + 1, vector<ll>(2*V + 1, 0));
    for (int i = 1; i <= V; i++){
        dp[cnt + i][1] = C[cnt + 1][cnt + i];
        recon[cnt+i][1] = cnt + 1 ;
    }

    for(int i=2;i<=P;i++){ // i개 설치 할 때 
        dnc(i, cnt + 1,cnt + V, cnt + 1 ,cnt + V);
    }
    if (res.xx > dp[cnt + V][P]){
        res.xx = dp[cnt + V][P];
        res.yy.clear();
        reconstruct(cnt, cnt + V, P);
    }
}

int main(){
    fast_io
    cin >> V >> P >> L;
    for(int i=1;i<=V;i++) {cin >> pos[i]; pos[i + V] = pos[i] + L;}
    // cost 전처리
    for(int i=1;i<=2*V;i++){
        for(int j=i;j<=2*V;j++){
            int mid = (i + j) >> 1;
            for(int k=i;k<=j;k++) {
                C[i][j] += abs(pos[k] - pos[mid]);
            }
        }
    }
    res.xx = INF;
    // cnt마다 최솟값 구하기
    for(int c = 0;c<V;c++) solve(c);
    cout << res.xx << '\n';
    sort(res.yy.begin(), res.yy.end());
    for(ll ans : res.yy) cout << ans << ' ';
}
```

내가 문제를 풀 때 실수로 좌표를 1 ~ L까지로보고 풀었는데 정답을 받았다. 
데이터에 좌표가 0인 경우가 없었던것 같아서 추가 요청을 백준에 드렸다.

또 틀렸던 부분이 지금 내 코드는 recon이라는 배열로 이전의 우체국 위치를 추적하고 있는데
우체국이 1개밖에 없는 경우는 따로 처리하고 있는데 recon배열을 같이 처리하지 않은 실수를 했다.
또, opt값의 default 0으로 해서 배열에서 out_of_bound를 받았다. 

이제 마지막 문제를 풀어보겠다.
### 예제 3
[12766 지사배정](https://www.acmicpc.net/problem/12766)
일단 i사에서 j사까지 메시지를 전달하려면 본사를 무조건 들러야한다. 
또한 하위 프로젝트를 맡은 지사끼리만 연결되면 된다. 
적절히 이동거리를 최소로 하도록 하위 프로젝트를 지사에 배정하면 된다.
이전 문제에서 우체국을 적절히 배치하는 것과 매우 비슷하다. 
근데 우체국 문제는 마을들이 정렬이 되어있어 dp식을 짜기 편했다. 하지만 이 문제는 그래프로 되어있어 그것이 까다로워진다. 

우체국 3 문제처럼 바꿔보자!!
```
dp[i][j] : i번째 지사까지 확인했고 그때 배정한 프로젝트가 j개 일때 최소거리
```
$$
dp[i][j] = min(dp[k][j-1] +C[k+1][i])
$$
여기서 C는 k+1부터 i까지를 한 그룹에 넣었을 때의 비용이다. 
$$
C[i][j] = (j-i) \times\sum\limits_{k=i}^{j}d_{k}
$$
gs는 그룹 사이즈라고 생각했다. 여기서 gs는 $j-i$이다. 
$d_i$ 는 i에서 본사까지 그리고 본사에서 i까지 오는데 걸리는 거리다. 

그리고 $d_i$가 크면 큰 그룹에 있을 수록 안좋고 $d_i$ 가 작으면 큰 그룹에 넣는게 낫다.
따라서 우리는 우체국 3 문제처럼 바꾸기 위해 $d_i$를 기준으로 정렬해서 해결 할 수 있다. 

1. 다익스트라로 각 정점 사이 거리를 구한다. $O(N^2\log N)$ 
2. $d_i$ 를 구해서 정렬 해둔다. 
3. $C_{i, j}$ 를 쉽게 구하기 위해 $d_i$ 의 prefix sum ps를 전처리 해둔다.
4. dnc optimization을 적용한다.!!

##### 첫번째 시간초과
위 방법으로 풀 수 있는줄 알았지만....
다익스트라 과정이 시간이 오래 걸렸는지 시간초과가 났다. 
이건 다익스트라 두 번으로 가능했다. 
b + 1번 정점에서 다른 모든 정점까지는 그냥 평소처럼 다익스트라하면 되고
다른 모든 정점에서 b+1까지는 간선들을 뒤집고 그것을 따라가면 된다.
따라서 다익스트라 과정을 $O(N\log N)$ 으로 줄였다.

##### 두번째 시간초과
하지만 또 시간초과를 받았다.
후보군은 다음과 같다.
1. 벡터가 오래걸린다. 
	1. reserve를 쓰거나
	2. 그냥 배열로 바꿔본다.
2. 분할정복 과정이 문제다.
	1. 지금 내 코드는 $O(bs\log b)$ 정도로 돌아가지만 잡스런 과정이 많다.

해결은 다음과 같이 했다. 
```cpp
for(int i=2;i<=s;i++){
	compute(i, 1, b, 1, b);
}
```
위 부분을
```cpp
for(int i=2;i<=s;i++){
	compute(i, i, b, i-1, b);
}
```
이렇게 바꿨다. 
s에 따라서 검사할 구간이 줄어드니까 이를 이용해 처음에 검사하는 구간을 줄여버리는 것이다. 

그래서 꽤 긴 시간, 2733ms정도로 겨우 통과했다 ㅠㅠ
### 구현 3
```cpp
#include <bits/stdc++.h>
#define fast_io cin.tie(NULL); ios_base::sync_with_stdio(false);
using namespace std;
typedef long long ll;
typedef pair<int, int> pii;
typedef pair<ll, ll> pll;
typedef tuple<int, int, int> tiii;
typedef tuple<ll, ll, ll> tlll;
#define xx first
#define yy second

const int MAX = 5001;
const ll INF = 1e15;
int n, b, s, r; 
vector<pll> G[MAX],R[MAX], firm;
vector<ll> D1,D2, ps;
vector<vector<ll>> dp;

vector<ll> dijkstra(int st, bool rev){
    vector<ll> dist(n+1, INF);
    dist[st] = 0;
    priority_queue<pll, vector<pll>, greater<pll>> pq;
    pq.push({dist[st], st});
    while(!pq.empty()){
        auto [d, now] = pq.top();
        pq.pop();
        if(dist[now] < d) continue;
        if(rev){
            for (auto [nxt, cost] : R[now]){
                if (dist[nxt] > dist[now] + cost){
                    dist[nxt] = dist[now] + cost;
                    pq.push({dist[nxt], nxt});
                }
            }
        }else{
            for (auto [nxt, cost] : G[now]){
                if (dist[nxt] > dist[now] + cost){
                    dist[nxt] = dist[now] + cost;
                    pq.push({dist[nxt], nxt});
                }
            }
        }
        
    }
    return dist;
}

inline ll C(ll i, ll j){ // i번 지사에서 j까지 한 그룹으로 묶을 때 최소거리
    return (j - i) * (ps[j] - ps[i-1]);
}

void compute(int x, int l, int r, int optl, int optr){
    if(l > r) return ;

    int mid = (l + r) >> 1;
    dp[mid][x] = INF;
    int opt = 1;
    for(int i=optl;i<min(mid , optr+1);i++){
        if (dp[mid][x] > dp[i][x - 1] + C(i + 1, mid)){
            dp[mid][x] = dp[i][x - 1] + C(i + 1, mid);
            opt = i;
        }
    }

    compute(x, l, mid-1, optl, opt);
    compute(x, mid+1, r, opt, optr);
}

ll solve(){
    dp.assign(b+1, vector<ll>(s+1, INF));
    ps.assign(b+1, 0);
    for(int i=1;i<=b;i++){
        ps[i] = ps[i-1] + firm[i].xx;
    }
    for(int i=1;i<=b;i++){
        dp[i][1] = C(1, i);
    }
    for(int i=2;i<=s;i++){
        compute(i, i, b, i-1, b);
    }
    
    return dp[b][s];
}

int main(){
    fast_io
    cin >> n >> b >> s >> r;
    for(int i=0;i<r;i++){
        ll u, v, w; cin >> u >> v >> w;
        G[u].push_back({v, w});
        R[v].push_back({u, w});
    }
    D1 = dijkstra(b+1, 0);
    D2 = dijkstra(b+1, 1);
    firm.assign(b+1, {0, 0});
    for(int i=1;i<=b;i++){
        firm[i] = {D1[i] + D2[i], i};
    }
    sort(++firm.begin(), firm.end());
    cout << solve();
}
```

# 마무리
아주 옛날에 탈옥이라는 문제를 블로그 뒤져가면서 풀고 묵혀놨던 최적화 테크닉인데 오랜만에 제대로 공부해서 다이아문제 2개를 풀 수 있었다. 꽤 쉬운 문제고 이런 문제의 형태는 찾아낼 수 있을 듯하다. 
하지만 대회나 풀이 중에 이 문제가 정확히 Monge array거나 단조성이 있는지 없는지를 증명하기는 꽤 어려울 듯하다. 
다음엔 더 재밌는 알고리즘을 또 올려보겠다. 
