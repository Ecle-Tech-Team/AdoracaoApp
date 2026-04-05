import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const HymnCard = ({ hymn, onPress, size = 'medium' }) => {
  // Determinar tamanhos baseado no prop size
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 120, fontSize: 12 };
      case 'large':
        return { width: 180, height: 180, fontSize: 16 };
      case 'medium':
      default:
        return { width: 150, height: 150, fontSize: 14 };
    }
  };

  const sizes = getSizes();

  // URL da imagem - usar placeholder se não houver imagem
  const imageUrl = hymn?.imagem || hymn?.image || `https://picsum.photos/${sizes.width}/${sizes.height}?random=${hymn?.id || Math.random()}`;

  // Extrair título e autor do hino
  const title = hymn?.titulo || hymn?.title || 'Hino sem título';
  const author = hymn?.autor || hymn?.author || 'Autor desconhecido';
  const number = hymn?.numero ? `#${hymn.numero}` : '';

  return (
    <TouchableOpacity
      style={[styles.card, { width: sizes.width }]}
      onPress={() => onPress && onPress(hymn)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: sizes.width, height: sizes.height }]}
        resizeMode="cover"
      />

      {/* Badge do número do hino */}
      {number && (
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
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
    fontWeight: '600',
    marginBottom: 2,
  },
  author: {
    color: '#666',
    fontSize: 12,
  },
});

export default HymnCard;