import { colors } from '@config/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contactRow: {
    backgroundColor: 'white',
    borderColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  githubContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  githubLink: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 20,
    justifyContent: 'center',
    marginTop: 20,
    width: 100,
  },
});
