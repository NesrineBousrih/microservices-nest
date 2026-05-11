# TP — Architecture Microservices avec NestJS
> REST • GraphQL • gRPC • Kafka

**Réalisé par :** Nesrine Bousrih  
**GitHub :** https://github.com/NesrineBousrih/microservices-nest

---

## Architecture

```
Client HTTP
├── REST ───────> catalog-service (port 3001)
├── REST ───────> order-service (port 3002) ── gRPC ──> stock-service (port 5001)
│                      │
│                      └── Kafka topic: order.created ──> notification-service
└── GraphQL ────> query-service (port 3003) ── REST ──> catalog-service / order-service
```

## Services

| Service | Responsabilité | Protocole | Port |
|---|---|---|---|
| `catalog-service` | CRUD des produits | REST + Swagger | 3001 |
| `stock-service` | Validation du stock | gRPC | 5001 |
| `order-service` | Création des commandes | REST + gRPC + Kafka | 3002 |
| `notification-service` | Confirmation des commandes | Kafka Consumer | — |
| `query-service` | Lecture agrégée | GraphQL | 3003 |

---

## Prérequis

- Node.js v20+
- npm
- Kafka installé localement (testé avec Kafka 2.13-4.0.2 en mode KRaft)
- NestJS CLI : `npm install -g @nestjs/cli`

---

## Lancer le projet

### Étape 1 — Démarrer Kafka

Ouvrir un terminal et exécuter :

```bash
cd C:\kafka_2.13-4.0.2
.\bin\windows\kafka-server-start.bat config\server.properties
```

> Attendre que les logs s'arrêtent de défiler — Kafka est prêt.

Ouvrir un **deuxième terminal** et créer le topic (seulement la première fois) :

```bash
cd C:\kafka_2.13-4.0.2
.\bin\windows\kafka-topics.bat --create --topic order.created --bootstrap-server localhost:9092
```

---

### Étape 2 — Démarrer catalog-service

```bash
cd catalog-service
npm install
npm run start:dev
```

> Attendre : `catalog-service running on http://localhost:3001`

---

### Étape 3 — Démarrer stock-service

```bash
cd stock-service
npm install
npm run start:dev
```

> Attendre : `stock-service running on gRPC port 5001`

---

### Étape 4 — Démarrer order-service

```bash
cd order-service
npm install
npm run start:dev
```

> Attendre : `order-service running on http://localhost:3002`

---

### Étape 5 — Démarrer notification-service

```bash
cd notification-service
npm install
npm run start:dev
```

> Attendre : `notification-service is listening on Kafka topic: order.created`

---

### Étape 6 — Démarrer query-service

```bash
cd query-service
npm install
npm run start:dev
```

> Attendre : `GraphQL playground at http://localhost:3003/graphql`

---

## Tester le projet

### Swagger (REST)

| Service | URL |
|---|---|
| catalog-service | http://localhost:3001/api |
| order-service | http://localhost:3002/api |

### GraphQL Playground

```
http://localhost:3003/graphql
```

---

## Jeux de tests

### 1. Créer un produit (catalog-service)

`POST http://localhost:3001/products`

```json
{
  "name": "Laptop",
  "price": 1200,
  "stock": 10
}
```

Réponse attendue : `201 Created`

---

### 2. Créer une commande valide (order-service)

`POST http://localhost:3002/orders`

```json
{
  "productId": 1,
  "quantity": 2,
  "customerEmail": "client@test.com"
}
```

Réponse attendue : `201 Created` avec `status: "CONFIRMED"`

> Vérifier dans le terminal de notification-service :
> `Confirmation sent to client@test.com for order #1`

---

### 3. Commande invalide — stock insuffisant

`POST http://localhost:3002/orders`

```json
{
  "productId": 1,
  "quantity": 999,
  "customerEmail": "client@test.com"
}
```

Réponse attendue : `400 Bad Request` — `"Not enough stock"`

---

### 4. Lister tous les produits (GraphQL)

```graphql
{
  products {
    id
    name
    price
    stock
  }
}
```

---

### 5. Lister toutes les commandes (GraphQL)

```graphql
{
  orders {
    id
    productId
    quantity
    customerEmail
    status
  }
}
```

---

### 6. Récupérer une commande par ID (GraphQL)

```graphql
{
  orderById(id: 1) {
    id
    productId
    quantity
    customerEmail
    status
  }
}
```

---

## Justification technique

| Protocole | Pourquoi ce choix |
|---|---|
| **REST** | Standard universel pour les API exposées au client. Simple, lisible, compatible avec tous les outils. |
| **gRPC** | Communication interne rapide entre order-service et stock-service. Utilise Protobuf (binaire) — plus performant que JSON. Contrat strict via fichier .proto. |
| **Kafka** | Découplage asynchrone entre order-service et notification-service. order-service publie un événement et n'attend pas la réponse. Idéal pour les notifications. |
| **GraphQL** | Lecture agrégée flexible depuis query-service. Le client demande exactement les champs dont il a besoin en une seule requête au lieu d'appeler plusieurs endpoints REST. |

---

## Structure du projet

```
microservices-nest/
├── catalog-service/        ← REST CRUD produits + Swagger + SQLite
├── order-service/          ← REST + gRPC client + Kafka producer + SQLite
├── stock-service/          ← gRPC server + stock en mémoire
├── notification-service/   ← Kafka consumer
├── query-service/          ← GraphQL + appels REST internes
└── README.md
```