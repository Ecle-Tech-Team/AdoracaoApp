# Integração do Dashboard com Navegação

## Funcionalidades Implementadas

### 1. Navegação para Telas de Hino
- **Ao clicar em um HymnCard**: O hino é aberto na tela apropriada (`Hino.js` ou `HinoGeral.js`)
- **Detecção automática**: Baseado no campo `tipo_hino` do hino
- **Histórico**: Mantém `previousScreen` para voltar corretamente

### 2. Tela "Ver Todos" (HymnsSection.js)
- **Layout similar ao Hinario.js**: Grid 2 colunas com cards
- **Filtros dinâmicos**: Carrega hinos baseado no tipo da seção
- **Busca integrada**: Filtra hinos por título/autor/número
- **Contador**: Mostra quantidade de hinos encontrados

### 3. Sistema de Contexto (SectionContext.js)
- **Compartilhamento de dados**: Entre Dashboard e HymnsSection
- **Persistência temporária**: Mantém dados da seção durante navegação
- **Limpeza automática**: Dados são substituídos a cada nova navegação

## Como Usar

### 1. Dashboard (dashboard.js)
```javascript
// Navegação para tela de hino
const handleHymnPress = (hymn) => {
  if (hymn.tipo_hino === 'GERAL') {
    navigateTo('HinoGeral', hymn, null, 'Dashboard');
  } else {
    navigateTo('Hino', hymn, null, 'Dashboard');
  }
};

// Navegação para "Ver todos"
const handleSeeAllPress = (sectionTitle, hymns) => {
  const filterType = sectionTitle.toLowerCase().replace(/\s+/g, '_');
  updateSectionData(sectionTitle, hymns, filterType);
  navigateTo('HymnsSection', null, null, 'Dashboard');
};
```

### 2. Componente Section
```javascript
<Section
  title="Recentemente Vistos"
  data={recentlyViewed}
  onItemPress={handleHymnPress}
  onSeeAllPress={handleSeeAllPress}
  loading={loadingSections.recentlyViewed}
/>
```

### 3. Hook useHymns
```javascript
const {
  hymns,                    // Todos os hinos
  loading,                  // Estado de carregamento
  filterHymns,              // Filtrar hinos
  getRecentlyViewed,        // Hinos recentes
  getNewReleases,           // Novos lançamentos
  getPopularHymns,          // Hinos populares
} = useHymns(userId);
```

## Filtros Disponíveis

### Por Hinário
```javascript
const harpaHymns = filterHymns({ hinario: 'harpa', limit: 6 });
const ccbHymns = filterHymns({ hinario: 'ccb', limit: 6 });
```

### Por Favoritos
```javascript
const favorites = filterHymns({ favoritesOnly: true, limit: 6 });
```

### Por Busca
```javascript
const searchResults = filterHymns({ search: 'amor', limit: 6 });
```

### Ordenação
```javascript
const byNumber = filterHymns({ sortBy: 'number', limit: 6 });
const byTitle = filterHymns({ sortBy: 'title', limit: 6 });
const recent = filterHymns({ sortBy: 'recent', limit: 6 });
```

## Componente HymnCard

### Tamanhos Disponíveis
```javascript
<HymnCard hymn={hymn} size="small" />    // 120x120px
<HymnCard hymn={hymn} size="medium" />   // 150x150px (padrão)
<HymnCard hymn={hymn} size="large" />    // 180x180px
```

### Propriedades
- `hymn`: Objeto do hino (deve ter `titulo`, `autor`, `imagem`, `numero`)
- `onPress`: Função chamada ao clicar no card
- `size`: Tamanho do card (`small`, `medium`, `large`)

## Estrutura de Dados do Hino

### Hino de Hinário (Harpa/CCB)
```javascript
{
  id: '123',
  tipo_hino: 'HARPA', // ou 'CCB'
  numero: 1,
  titulo: 'Grande é o Senhor',
  autor: 'Autor desconhecido',
  imagem: 'https://...', // URL da imagem
  coro: 'Coro do hino...',
  verses: { '1': 'Verso 1...', '2': 'Verso 2...' }
}
```

### Hino Geral
```javascript
{
  id: '456',
  tipo_hino: 'GERAL',
  titulo: 'What a Beautiful Name',
  autor: 'Hillsong Worship',
  imagem: 'https://...',
  verses: { '1': 'Verso 1...', '2': 'Verso 2...' }
}
```

## Configuração Necessária

### 1. ID do Usuário
No dashboard.js, substitua `userId = 'user123'` pelo ID real do usuário logado:
```javascript
// dashboard.js linha ~86
const userId = user.id_user; // Usar ID real do usuário
```

### 2. Integração com AsyncStorage
Para funcionalidade completa de "Recentemente Vistos", implemente:
- Salvar hinos visualizados no AsyncStorage
- Recuperar do AsyncStorage no hook `getRecentlyViewed`

### 3. Estatísticas de Popularidade
Para "Hinos Populares" precisos, implemente:
- Contador de visualizações por hino
- Sistema de "curtidas" ou favoritos
- API para estatísticas de uso

## Problemas Conhecidos

### 1. Dados Mockados
Algumas seções usam dados mockados/aleatórios:
- "Novos Lançamentos": Primeiros 50 hinos
- "Hinos Populares": Hinos aleatórios
- "Recentemente Vistos": Primeiros hinos por data

### 2. Performance
- Grande quantidade de hinos pode afetar performance
- Considerar paginação para listas grandes
- Implementar cache de imagens

## Melhorias Futuras

### 1. Paginação
- Implementar `FlatList` com `onEndReached` para carregar mais hinos
- Adicionar `ActivityIndicator` no final da lista

### 2. Cache
- Cache de imagens com `react-native-fast-image`
- Cache de dados da API com tempo de expiração

### 3. Personalização
- Permitir reordenar seções do dashboard
- Opção de esconder seções não desejadas
- Tema claro/escuro

### 4. Offline
- Download de hinos para uso offline
- Sincronização automática quando online
- Indicador de status offline