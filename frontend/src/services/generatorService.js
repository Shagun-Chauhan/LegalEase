import api from '../api';

const generatorService = {
  getDraft: (data) => api.post('/generator/draft', data),
  finalizeDocument: (data) => api.post('/generator/finalize', data),
  getMyDocuments: () => api.get('/generator/my-documents'),
};

export default generatorService;
