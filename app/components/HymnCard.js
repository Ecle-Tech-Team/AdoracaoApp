import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React from 'react';

// 5 cores sólidas para hinos GERAL sem imagem
const CORES_SOLIDAS = [
  '#285470', // azul
  '#702828', // vermelho
  '#28705F', // verde 
  '#2E2E2E', // preto
  '#5B2870', // roxo
];

// Cor para hinos de hinário (HARPA/CCB)
const COR_HINARIO = '#D9D9D9';

// Gerar cor consistente baseada no ID do hino
const getCorPorId = (id) => {
  if (!id) return CORES_SOLIDAS[0];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CORES_SOLIDAS.length;
  return CORES_SOLIDAS[index];
};

// Determinar tipo do hino
const getTipo = (hymn, hinarioType) => {
  return (hinarioType || hymn?.tipo_hino || hymn?.hinario || 'GERAL').toUpperCase();
};

const HymnCard = ({ hymn, onPress, size = 'medium', hinarioType }) => {
  // Determinar tamanhos baseado no prop size
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 120, fontSize: 12, iconSize: 36, badgeSize: 28 };
      case 'large':
        return { width: 180, height: 180, fontSize: 16, iconSize: 54, badgeSize: 42 };
      case 'medium':
      default:
        return { width: 150, height: 150, fontSize: 14, iconSize: 45, badgeSize: 35 };
    }
  };

  const sizes = getSizes();
  const tipo = getTipo(hymn, hinarioType);
  const temImagemPropria = !!(hymn?.imagem || hymn?.image);
  const isHinario = tipo === 'HARPA' || tipo === 'CCB';
  const number = hymn?.numero;

  // Determinar cor de fundo e se usa imagem real
  const corFundo = isHinario ? COR_HINARIO : getCorPorId(hymn?.id || hymn?._id);

  // Extrair título e autor do hino
  const title = hymn?.titulo || hymn?.title || 'Hino sem título';
  const author = hymn?.autor || hymn?.author || 'Autor desconhecido';

  return (
    <TouchableOpacity
      style={[styles.card, { width: sizes.width }]}
      onPress={() => onPress && onPress(hymn)}
      activeOpacity={0.7}
    >
      {/* Imagem ou fallback com cor sólida */}
      {temImagemPropria ? (
        <Image
          source={{ uri: hymn.imagem || hymn.image }}
          style={[styles.image, { width: sizes.width, height: sizes.height }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.fallbackImage,
            {
              width: sizes.width,
              height: sizes.height,
              backgroundColor: corFundo,
            },
          ]}
        >
          {isHinario ? (
            <>
              {/* Ícone de livro para HARPA/CCB */}
              {number && (
                <Text style={[styles.hymnNumberLarge, { fontSize: sizes.badgeSize }]}>
                  {number}
                </Text>
              )}
              <Feather style={[styles.bookIcon, { fontSize: sizes.iconSize }]} name="book-open" size={24} color="white" />
              {/* Número grande do hino no centro */}
            </>
          ) : (
            /* Ícone de música para GERAL */            
            <Feather style={[styles.musicIcon, { fontSize: sizes.iconSize }]} name="music" size={24} color="white" />
          )}
        </View>
      )}

      {/* Badge do número do hino (apenas para hinos com imagem própria) */}
      {number && temImagemPropria && (
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>#{number}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { fontSize: sizes.fontSize }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    position: 'relative',
  },
  image: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  fallbackImage: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  bookIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  musicIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  hymnNumberLarge: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: 'bold',
    marginTop: -4,
  },
  numberBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  numberText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 2,
  },
  title: {
    color: 'black',
    fontWeight: '800',
    marginBottom: 2,
  },
  author: {
    color: '#666',
    fontSize: 12,
  },
});

export default HymnCard;
