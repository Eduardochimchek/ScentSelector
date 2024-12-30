from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS  # Importando o CORS

app = Flask(__name__)
CORS(app)  # Ativando o CORS

# Carregar o modelo previamente treinado
with open('model/perfume_predictor_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receber as respostas como JSON
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Erro ao processar o JSON'}), 400

        answers = data.get('answers')

        if not answers:
            return jsonify({'error': 'Respostas não recebidas'}), 400

        # Extrair as respostas do JSON
        clima = answers.get('clima')
        fragrancia = answers.get('fragrancia')
        perfume_intensidade = answers.get('perfume_intensidade')

        # A parte crucial: Prepare as variáveis de entrada para o modelo
        input_data = [clima, fragrancia, perfume_intensidade]

        # Aqui você pode codificar os dados ou transformá-los para o formato que seu modelo espera
        # Como o modelo foi treinado com variáveis categóricas codificadas, você deve fazer isso da mesma maneira.

        # Exemplo de como fazer a previsão
        prediction = model.predict([input_data])  # A previsão do modelo

        # Retornar o nome do perfume previsto
        return jsonify({'result': prediction[0]})
    
    except Exception as e:
        return jsonify({'error': f'Erro interno: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Certifique-se de que o Flask está rodando na porta 5000
