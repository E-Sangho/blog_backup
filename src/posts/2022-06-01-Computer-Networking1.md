---
title: Computer Networking Chapter 1
date: 2022-06-01 13:59:35
layout: series
series: NetWorking
thumbnail: ../assets/images/networking.jpg
summary: Computer Networking
categories: [CS]
---

# 1. Computer Newtorks and the Internet

이 책의 첫 번째 장은 컴퓨터 네트워킹의 개요를 제시한다.
전체적으로 어떤 내용을 다루는지 간략하게 이해하고, 기초적인 지식을 알려준다.
기본 용어와 개념을 알려준 후, 네트워크를 구성하는 하드웨어와 소프트웨어의 구성요소를 살펴본다.
그리고 네트워크의 Edge에서 시작해서 end system과 네트워크에서 동작하는 애플리케이션을 알아보겠다.
이후 네트워크의 core에 대해 살펴보는데, link와 switch를 알아본다.
네트워크의 데이터 전송 지연과 손실 원인을 살펴본다.
그리고 종단 간의 지연에 대한 간단한 모델을 알아본다.
네트워킹의 주요 구조 원리, 즉 프로토콜 계층구조와 서비스 모델을 소개한다.
그리고 네트워크는 다양한 유형의 공격에 취약한 것을 배울 것이다.
어떤 종류의 공격이 있는지 살펴보고, 네트워크를 더 안전하게 만드는지 알아본다.
마지막으로 컴퓨터 네트워킹의 역사를 간략하게 살펴보고 이 장을 마친다.

## 1.1 What is the Internet?

"인터넷이란 무엇인가?" 이 질문에 대한 대답은 크게 2종류가 있다.
첫 번째는 인터넷의 하드웨어와 소프트웨어를 설명하는 것이다.
두 번째는 네트워크 서비스를 서술하는 것이다.

### 1.1.1 A Nuts-and-Bolts Description

우선 인터넷의 하드웨어와 소프트웨어를 설명해보겠다.
인터넷은 전세계의 컴퓨터를 연결한다.
과거에는 주로 데스크톱, 워크스테이션, 서버 등을 연결했지만, 현재는 노트북, 태블릿, 스마트폰, TV 등 다양한 장치에 연결되고 있다.
이 때문에 "컴퓨터 네트워크"란 표현은 한물간 표현이 되었다.
인터넷이 연결하는 각 장치는 **host(호스트)** 또는 **end systems(종단 시스템)**라고 불린다.

종단 시스템은 **communication link(통신 링크)**와 **packet switch(패킷 스위치)**로 연결된다.
통신 링크는 동축케이블, 구리선, 광케이블, 라디오 스펙트럼 등을 말한다.
각각 다른 **transmission rate(전송률)**을 가지고 있으며, 전송률은 **bps(초당 비트 수)**를 단위로 사용한다.

종단 시스템이 데이터를 전송할 때, 그 데이터를 **segment**으로 나누고, 각 세그먼트에 헤더를 붙인다.
이렇게 만들어진 정보를 **packet**이라고 부른다.
패킷은 네트워크를 통해 목적지로 전송되고, 목적지에서 데이터로 다시 조립된다.

패킷 스위치는 통신 링크를 통해 패킷을 전달 받고 내보낸다.
패킷 스위치는 여러 종류가 있는데 그 중에서 가장 많이 쓰이는 것은 **router**과 **link-layer swit**다.
두 패킷 스위치는 패킷을 목적지로 전달하는데 사용된다.
링크 레이어 스위치는 access network(접속 네트워크)에 사용되고, 라우터는 network core에 사용된다.
패킷이 전달되는 동안 거쳐온 패킷 스위치와 통신 링크를 경로라고 한다.

종단 시스템은 **ISP(Internet Service Provider)**를 통해 인터넷에 접속한다.
ISP는 패킷 스위치와 통신 링크로 이루어진 네트워크다.
인터넷은 각 종단 시스템을 연결하는 것이므로, ISP 역시 서로 연결되어야 한다.
ISP는 여러 단계로 나눠져 있는데, 하위 ISP는 국제 상위 계층 ISP를 통해 서로 연결된다.
ISP 네트워크는 IP 프로토콜을 실행하고, 규칙에 따라 이름과 주소를 만든다.

**Protocol**은 인터넷에서 정보 송수신을 제어한다.
종단 시스템, 패킷 스위치 등은 프로토콜을 따라 명령을 수행한다.
**TPC(Transmission Control Protocol)**과 **IP(Internet Protocol)**은 가장 중요한 프로토콜이다.
IP는 패킷의 구성 방식을 규정한다.
인터넷의 주요 프로토콜을 일컬어 TCP/IP라고 한다.

인터넷에서 프로토콜은 굉장히 중요해서, 각 프로토콜이 무엇을 하는지 규정을 정하는 것이 중요하다.
그로 인해 서로 호환되는 제품을 만들 수 있게 된다.
Internet Standard는 IETF에서 개발하며, IETF 표준 문서를 RFCs(requests for comments)라고 한다.

### 1.1.2 A Services Description

이번에는 네트워크 서비스로써의 인터넷을 설명하겠다.
종단 시스템의 애플리케이션이 다른 종단 시스템으로 데이터를 전달하려면 **socket interface**를 사용한다.
소켓 인터페이스는 송신 프로그램이 지켜야 할 규칙으로, 인터넷은 규칙을 따라 목적지로 데이터를 전달한다.

### 1.1.3 What is Protocol?

프로토콜은

## 1.2 The Network Edge

종단 시스템은 종종 호스트라고 불리는데, 종단 시스템이 어플리케이션 프로그램을 실행시키는 주체이기 때문이다.
호스트는 클라이언트와 서버로 구분된다.
일반적으로 클라이언트는 데스크탑, 스마트 폰 등을 의미하고, 서버는 웹 페이지를 저장하는 좀 더 전문적인 컴퓨터를 의미한다.

### 1.2.1 Access Network

Access Network는 엔드 시스템간의 연결 경로 중 첫 번째 라우터에 연결하는 네트워크를 말한다.

#### Home Access: DSL, Cable, FTTH, and 5G Fixed Wireless

오늘날 가정에서 가장 많이 쓰이는 연결은 DSL(Digital Subscriber Line)과 cable이다.
각 가정은 Kt 같은 통신사의 DSL 서비스를 사용한다.
이때 각 가정의 DSL 모뎀은 전화 회선(꼬임쌍선)을 사용한다.
전화 회선은 데이터와 전화 신호를 동시에 전달하는데, 구분을 위해 서로 다른 주파수 대역을 사용한다.
이로 인해 같은 회선을 사용하면서도 서로 다른 데이터 전송이 가능해진다.
인터넷 회사의 DSLAM(Digital Subscriber Line Access Multiplexer)는 데이터와 전화 신호를 분리해서 인터넷으로 송신한다.
반대로 돌아오는 신호의 경우 스플리터가 전화와 인터넷 신호를 분리한다.
그래서 통신 신호는 전화기로 가고, 데이터는 DSL 모뎀을 거쳐 엔드 시스템으로 전달된다.

DSL은 업스트림과 다운스크림 속도가 다르기 때문에 비대칭 접속이라고 한다.
다운스트림이 업스트림보다 빠르다.
하지만 속도는 이론만큼 나오지 않을 수 있다.
이는 이동시의 지연이 있을 수 있고, 요금제에 따라 회상에서 제한할 수 있기 때문이다.

DSL이 기존의 전화 구조를 이용하는 반면 케이블 인터넷 접속은 케이블 TV의 구조를 사용한다.
각 가정은 케이블 TV 회사로부터 인터넷 접속 서비스를 사용한다.
광케이블은 케이블 헤드 엔드를 이웃-레벨 정션에 연결하고, 각 가정에 도달하는데는 동축 케이블을 사용한다.
광케이블과 동축 케이블을 같이 사용하므로 이를 HFC(Hybrid Fiber Coax)라고 한다.

케이블 인터넷 접속은 케이블 모뎀을 사용한다.
DSL 모뎀과 마찬가지로, 케이블 모뎀은 외장형 장치다.
케이블 모뎀은 HFC 네트워크를 다운스트림과 업스트림으로 나눈다.
DSL과 마찬가지로 비대칭 접속을 사용하며, 다운스트림 채널이 업스트림보다 빠르다.

케이블 인터넷의 특징은 대역폭을 공유한다는 것이다.
그래서 동시에 여러 사람이 사용한다면, 대역을 나눠서 사용하기 때문에 느려진다.

DSL과 케이블 네트워크가 주된 기술이지만, 그 외에도 FTTH(Fiber to the Home)이라는 기술이 있다.
FTTH는 회사에서 가정까지 경로로 광섬유를 사용한다.

광신호는 일반적으로 여러 가정이 공유한다.
그리고 각 가정의 가까운 곳에서 각 고객별로 광섬유를 분리한다.
이를 수행하는 광신호 분배 네트워크 구조는 AON(active optical network), PON(passive optical network) 두 종류가 있다.

그 외에도 위성 링크를 사용한 인터넷 접속을 사용할 수도 있다.

#### Access in the Enterprise Ethernet and Wifi

LAN(local area network)은 엔드 시스템을 엣지 라우터에 연결하기 위해 사용한다.
LAN 기술 중에서 가장 널리 쓰이는 것은 이더넷이다.
이더넷은 이더넷 스위치에 연결하기 위해 꼬임쌍선을 사용한다.
그리고 이더넷 스위치는 다시 더 큰 인터넷으로 연결된다.

최근 사람들은 WiFi라고 불리는 무선 랜 기술을 주로 사용한다.

#### Wide-Area Wireless Access: 3G and LTE 4G and 5G

### 1.2.2 Physical Media

한 엔드 시스템에서 다른 엔드 시스템으로 비트를 전달하려면 여러 링크와 라우터를 거쳐야 한다.
이때 비트가 이동하는 경로는 물리적으로 연결되는 경우와 연결되지 않는 경우가 있다.
물리적으로 연결되는 경우는 광섬유 케이블, 꼬임쌍선, 동축 케이블 같은 실제 통신 경로가 존재한다.
이를 유도 매체(guided media)라고 한다.
반면 위성 채널처럼 신호를 전파로 전달하는 경우를 비유도 매체(unguided media)라고 한다.

각 물리 매체의 특성을 알아보기 전에 잠시 비용을 언급하겠다.
동선, 광케이블의 비용은 다른 네트워크에 비해 상당히 저렴하다.
오히려 설치하는데 드는 임금이 더 많이 나간다.
이 때문에 대부분 꼬임쌍선, 광케이블, 동축케이블을 설치한다.

#### Twisted-Pair Copper Wire

꼬임쌍선은 모든 매체중 가장 싸고 많이 이용된다.
지난 100년 넘게 전화망으로 사용했으며, 대부분의 가정에서 꼬임쌍선을 사용한다.
꼬임쌍선은 2개의 동선을 꼬은 것으로, 선을 꼬음으로써 선간의 전기 간섭을 줄인다.
일반적으로 여러 쌍을 케이블에 함께 묶어 사용하며, 각 쌍이 하나의 통신을 담당한다.
UTP(unshielded twisted pair)는 LAN에서 가장 많이 사용한다.

1980년대 광섬유 기술이 출현하자, 꼬임쌍선은 낮은 속도 때문에 저평가 받았다.
그러나 현대 꼬임쌍선은 수백 미터 거리에서 10Gbps 로 상당히 빠르다.
이로 인해 현대 가정에서도 널리 사용된다.

#### Coaxial Cable

동축 케이블은 중앙에 심지 같은 구리선이 있고, 그 주변을 감싸는 그물 같은 절연체 구리로 이뤄져 있다.
이렇게 원통형으로 심지를 감싸면 전자기장을 차폐해서 외부 간섭을 덜 받게 된다.
이로 인해 꼬임쌍선보다 더 높은 전송률이 나온다.
일반적으로 케이블 TV에 사용된다.

#### Fiber Optics

광섬유는 비트를 빛의 파동으로 전달해서, 10 ~ 100Gbps의 높은 전송 속도가 특징이다.
전자기장의 간섭을 받지 않아 신호감쇠 현상이 적다.
그 때문에 먼 거리로 전송할 때 사용되는데, 특히 해저 링크에 광섬유를 사용한다.
대부분의 국가의 전화 네트워크에 사용된다.
그렇지만 광섬유용 송신기, 수신기, 스위치 등의 장치가 매우 고가라서, 랜이나 가정처럼 근거리 통신에 사용하면 비효율적이다.

#### Terrestrial Radio Channels

라디오는 전파로 신호를 전달한다.
물리적 연결을 할 필요가 없고, 건물 외부에서 이동하면서 사용할 수 있으며, 먼 거리까지 송신이 가능하다.
문제는 거리가 멀어질수록 손실율이 높아지고, 노이즈가 섞이게 된다.

#### Satellite Radio Channels

통신 위성

## 1.3 The Network Core

인터넷 엣지를 살펴봤으므로, 네트워크 코어인 패킷 스위치와 링크를 알아보자.

### 1.3.1 Packet Switching

엔드 시스템은 데이터를 교환하기 위해 패킷이라는 작은 덩어리로 데이터를 나눈다.
각 패킷은 통신 링크와 패킷 스위치를 거쳐서 전송된다.

#### Store-and Forward Transmission

대부분의 패킷 스위치는 저장 후 전달 방식을 사용한다.
패킷 스위치는 먼저 패킷을 모두 전송받아 저장한 다음, 이를 다음 경로로 전송해준다.
이 때문에 전송 속도에 지연이 생기게 된다.
예를 들어서 L비트의 패킷 3개가 있고, 전송 속도가 M비트라고 하자.
하나의 패킷이 모두 전송되려면 $L/M$의 시간이 필요하다.
그런데 하나의 패킷이 전송이 완료된 이후 바로 다음 전송이 시작될 수 없다.
왜냐하면 스위치에서 저장한 후에 이를 다음 패킷 스위치로 전송을 완료한 이후에야, 전송이 시작되기 때문이다.
패킷 스위치가 패킷을 전송하기 위해선 역시 $L/M$의 시간이 필요하다.
그러므로 하나의 패킷을 전송하는데 $2L/M$의 시간이 필요하다.

그런데 패킷이 도착하는 도중에도 전송을 할 수 있다면, 전송이 완료될때까지 기다리지 않으므로 $L/R$의 시간에 하나의 패킷을 전송할 수 있다.
만약 사이에 n개의 패킷 스위치가 있다면 하나의 패킷을 목적지까지 전송하는 시간은 $nL/R$이 된다.

#### Queuing Delays and Packet Loss

패킷 스위치는 여러 링크를 가지고 있다.
각 링크는 output buffer(or output queue)에 전송하려는 패킷을 저장하고 있다.
출력 버퍼는 전송해야 하는 링크가 이미 사용중일 경우 대기하는데 사용한다.
따라서 패킷은 출력 버퍼에서 큐잉 지연(queueing delay)를 격는다.
큐잉 지연은 네트워크의 혼잡도에 따라 달라진다.
만약 버퍼가 가득차 있는 상태에서 패킷이 도착하면, 패킷 손실(packet loss)가 발생한다.
이 경우 도착하는 패킷이 손실되거나, 버퍼에서 대기 중인 패킷이 사라진다.

#### Forwarding Tables and Routing Protocols

라우터는 링크로 패킷을 받아서 다른 링크로 보내준다.
그런데 라우터는 어떻게 패킷이 전달될 링크를 결정할까?
인터넷에서 모든 엔드 시스템은 IP 주소를 사용한다.
송신자는 패킷을 보낼때 패킷의 헤더에 목적지 IP 주소를 포함시킨다.
라우터는 전달 테이블(forwarding table)이라는 주소에 따라서 전송 시킬 위치를 적은 테이블을 가지고 있다.
라우터는 패킷의 IP 주소를 보고, 전달 테이블로 어떤 링크로 보낼지 결정한다.
하지만 이로써 질문이 완전히 해소되지는 않는데, 전달 테이블은 어떻게 만드는가 하는 의문으로 이어지기 때문이다.
이는 추후에 5장에서 자세히 다룬다.

### 1.3.2 Circuit Switching

네트워크로 데이터를 전송하는 방식은 회선 교환(circuit switching)과 패킷 교환(packet switching)이라는 2가지 방식이 있다.
앞서 패킷 교환 방식을 설명했으므로 이번에는 회선 교환 방식을 알아보자.
회선 교환은 네트워크를 예약한다.
패킷 교환에서는 그때그때 오는 패킷을 받아서 링크로 연결한다.
하지만 얼마만큼의 패킷이 올지 모르므로 버퍼에서 대기하는 경우가 생긴다.
반면 회선 교환은 경로상에 필요한 버퍼, 전송률, 링크를 예약해서 사용한다.
이 때문에 통신 시간동안 해당 경로를 독자적으로 사용하고, 회션 교환처럼 큐잉 지연이 발생하지 않는다.

대표적인 회선 교환의 예시는 전화망이 있다.
전화망은 전송자와 수신자 사이의 스위치와 링크에 일정한 전송률을 예약한다.
이로 인해 전송자는 동일한 전송률로 데이터를 보낼 수 있게 된다.

#### Multiplexing in Circuit-Switched Network

두 스위치 사이의 링크는 여러 회선으로 나뉜다.
각 회선은 주파수-분할 다중화(frequency-division multiplexing, FDM)이나 시-분할 다중화(time-division multiplexing, TDM)으로 구현된다.
FDM은 주파수의 범위로 회선을 나누는 방식으로, 4kHz 단위로 회선을 나눈다.
TDM은 시간을 일정 간격으로 나눠서 데이터를 번갈아가며 보내주는 방법이다.

패킷 교환이 회선 교환보다 좋다고 생각하는 사람들은, 회선 교환에 할당된 회선이 쓰지 않는 기간이 존재하므로 낭비라고 주장했다.
예를 들어 전화중에 아무런 말을 하지 않더라도 통화는 그대로 유지된다.
그 때문에 네트워크 자원은 예약된채로 남고, 다른 네트워크에서 사용할 수 없어서 비효율적이다.

#### Packet Switching vs Circuit Switching

패킷 교환을 반대하는 사람은 지연이 예측할 수 없기 때문에 실시간 서비스에 적절하지 않다고 생각한다.
반면 패킷 교환을 선호하는 사람은 전송 용량 공유가 효율적이고, 구현 비용이 더 적다고 생각한다.
오늘날 패킷 교환이 좀 더 많이 사용된다.

### 1.3.3 A Network of Networks

## 1.4 Delay, Loss and Throughput in Packet-Switched Networks

이상적인 네트워크는 지연도 없고 손실도 없어야 한다.
하지만 현실에서 이는 불가능하며 이런 문제를 어떻게 다뤄야 할지 알아봐야 한다.

### 1.4.1 Overview of Delay in Packet-Switched Newtorks

패킷 지연은 노드 처리 지연(nodal processing delay), 큐잉 지연(queuing delay), 전송 지연(transmission delay), 전파 지연(propagation delay)가 있으며, 이 지연이 합쳐져 전체 지연을 일으킨다.

#### Process Delay

패킷을 전달할 때 패킷 스위치는 패킷 헤더를 조사해서 어디로 보낼지 결정한다.
이 시간동안 발생하는 지연을 처리 지연이라고 한다.
처리 지연은 그 외에도 패킷의 오류를 확인하는 등의 다른 지연을 포함하기도 한다.

#### Queuing Delay

큐잉 지연은 패킷이 큐에서 링크로 전달되기를 기다리면서 발생하는 지연이다.

#### Transmission Delay

전송 지연은 패킷의 모든 비트를 링크로 전송하는데 필요한 시간이다.
예를 들어서 패킷이 L만큼 있고 전송률이 R이라면 $L/R$의 시간이 필요하다.

#### Propagation Delay

전파 지연은 비트가 링크를 통해 다른 라우터에 도착하기까지의 시간이다.
전파 속도는 광속에 근접하며, 전파 지연은 거리를 전파 속도로 나눈 것이다.

#### Comparing Transmission and Propagation Delay

전송 지연과 전파 지연을 헷갈리는 경우가 종종 있다.
전송 지연은 라우터가 패킷을 내보내는데 필요한 시간이다.
반면 전파 지연은 한 라우터에서 다른 라우터로 전파되는데 걸리는 시간이다.

### 1.4.2 Queuing Delay and Packet Loss

노드 지연 중 가장 복잡하고 흥미로운 것은 큐잉 지연이다.
$L$ 만큼의 패킷이 있다고 하고, 해당 패킷의 전송률을 $a$라고 하자.
그러면 1초 동안 $La$ 만큼의 패킷이 도착한다.
이제 링크의 전송률을 R이라고 하면 1초에 R만큼을 라우터에서 내보낼 수 있다.
만약 La가 R보다 크다면 패킷이 계속해서 쌓이고 큐잉 지연은 끝없이 늘어난다.
그러므로 트래픽 강도(${La \over R}$)을 1보다 작게 설계해야 한다.

트래픽 강도가 1보다 작은 경우엔, 한 번에 패킷이 얼마나 몰리냐가 지연을 결정한다.
주기적으로 신호가 들어온다면 패킷 지연이 일어나지 않지만, 한꺼번에 들어오면 패킷 지연이 일어난다.
물론 두 가지 경우 모두 이론적인 경우이며, 실제로는 랜덤하게 패킷이 전송된다.

#### 패킷 손실

큐의 사이즈는 유한하므로 트래픽 강도가 높으면 패킷이 가득차게 된다.
이때 추가로 패킷이 들어오면 라우터는 그 패킷을 받아들일 수 없어서 손실이 일어난다.
그러므로 트래픽 강도가 높으면 지연이 일어날 뿐만 아니라, 패킷 손실이 일어날 수 있다.

### 1.4.3 End-to-End Delay

지금까지는 한 라우터 내에서 일어나는 지연을 살펴봤다.
이번에는 출발지에서 종점까지의 지연을 살펴보겠다.
총 지연 시간에는 각 라우터에서 일어나는 지연이 모두 포함된다.
하지만 각 라우터의 지연 외에도 다른 지연 요소가 존재한다.
예를 들어 공유기나 케이블 모뎀은 프로토콜을 의도적으로 지연시키기도 한다.
또한 데이터를 패킷으로 전환시키는 과정에서 지연이 일어날 수 있다.

### 1.4.4 Throughput in Computer Networks

패킷 손실과 지연 외에 네트워크 처리량 역시 성능에 큰 영향을 미친다.
서로 연결된 두 링크가 있을 때, 둘의 전송률이 다른 경우를 생각해보자.
뒤의 링크가 앞의 링크보다 전송률이 높면 아무런 문제가 되지 않는다.
그렇지만 뒤의 링크가 앞의 링크보다 전송률이 낮으면 병목현상이 생긴다.
두 경우 모두 처리량은 전송률 중에 낮은 것으로 정해진다.
이는 경로의 수가 늘어나도 동일하므로 처리량은 각 전송률 중 가장 낮은 것이 된다.
수식으로 표현하자면 $\underset{i \in N}{min}{R_i}$가 된다.

이는 네트워크가 일직선인 경우를 따진 것이다.
만약 네트워크가 한 곳에 모인다면 전송 속도를 균일하게 나눌 것이다.
그리고 해당 값이 전체 경로에서 가장 작다면 그 값이 네트워크 속도가 된다.

## 1.5 Protocol Layers adn Their Service Models

### 1.5.1 Layerd Architecture

#### Protocol Layering

#### Application Layer

HTTP, SMTP, FTP

#### Transport Layer

TCP, UDP

#### Newwork Layer

datagram

#### Link Layer

#### Physical Layer

### 1.5.2 Encapsulation

## 1.6 Networks Under Attack

네트워크 보안은 어떻게 네트워크를 공격할 수 있는지, 어떻게 방어할 수 있는지, 그리고 공격에 영향 받지 않는 구조 설계에 관한 것이다.
네트워크 보안은 많은 배경지식을 요구한다.
그러므로 여기서는 비교적 간단한 네트워크 공격을 알아보겠다.

#### Malware

#### Server and Network Infrastructure

DoS(denial of service) 공격은 네트워크, 호스트, 기반구조를 사용자가 쓸 수 없게 한다.
대부분의 DoS 공격은 아래 3가지 분류 중 하나에 속한다.

-   취약성 공격(vulnerability attack)
-   대역폭 플러딩(bandwidth flooding): 목표 호스트에 수 많은 패킷을 보낸다. 이로 인해 정상적인 패킷이 호스트에 도달하지 못하게 한다.
-   연결 플러딩(connection follding)

#### Sniff Packets

#### Masquerade

IP spoofing