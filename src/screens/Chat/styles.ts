import { StyleSheet } from 'react-native';
import { colors } from '@config/constants';

export const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
    width: 120,
  },
  avatarLabel: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  cell: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 0.5,
    marginBottom: 15,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chatHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chatTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  groupLabel: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  userContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  usersList: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 0.5,
    marginHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  usersTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 20,
  },
});

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatList: {
    backgroundColor: 'white',
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
  inputToolbar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 4,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  scrollToBottomButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emojiModal: {
    maxHeight: 300,
  },
});
