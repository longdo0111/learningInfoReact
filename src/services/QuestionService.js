import axios from 'axios';

let QUESTION_API_BASE_URL = "http://localhost:8080/api/v1/questions";

class QuestionService {

    getAllQuestion(){
        return axios.get(QUESTION_API_BASE_URL);
    }
}
export default new QuestionService();