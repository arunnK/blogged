import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PostsReducer from './reducer_posts';
import UserReducer from './reducer_user';
import ValidateUserFieldsReducer from './reducer_validateUserFields';
import UpdateEmailReducer from './reducer_updateEmail';

const rootReducer = combineReducers({
  user: UserReducer,
  validateFields: ValidateUserFieldsReducer,
  posts: PostsReducer, // <-- Posts
  form: formReducer, // <-- redux-form
  updateEmail: UpdateEmailReducer,
});

export default rootReducer;
