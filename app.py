from flask import Flask, request, jsonify
import pickle
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Carregar o modelo e os encoders
try:
    with open('model/modelo_random_forest.pkl', 'rb') as f:
        model = pickle.load(f)

    with open('model/intensidade_encoder.pkl', 'rb') as f:
        intensidade_encoder = pickle.load(f)

    with open('model/label_encoder.pkl', 'rb') as f:
        encoder = pickle.load(f)
        print(type(encoder))

    
    # Verificar os tipos dos encoders
    if not isinstance(encoder, LabelEncoder):
        raise ValueError("O arquivo 'label_encoder.pkl' não contém um objeto LabelEncoder válido.")
    
    if not isinstance(intensidade_encoder, LabelEncoder):
        raise ValueError("O arquivo 'intensidade_encoder.pkl' não contém um objeto LabelEncoder válido.")
except Exception as e:
    print(f"Erro ao carregar os modelos ou encoders: {e}")
    raise

# Função para codificar a entrada
def codificar_entrada(entrada, encoder):
    try:
        if entrada in encoder.classes_:
            return encoder.transform([entrada])[0]
        else:
            # Tratar entradas desconhecidas usando o primeiro valor como fallback
            return encoder.transform([encoder.classes_[0]])[0]
    except AttributeError:
        raise ValueError("O encoder fornecido não é válido. Verifique o arquivo salvo.")

# Função para prever a intensidade e o nome do perfume
def prever_intensidade_nome_perfume(ocasião, periodo, clima, sexo, sentimento, notas, estilo, faixa_etaria):
    try:
        codificado = [
            codificar_entrada(ocasião, label_encoder),
            codificar_entrada(periodo, label_encoder),
            codificar_entrada(clima, label_encoder),
            codificar_entrada(sexo, label_encoder),
            codificar_entrada(sentimento, label_encoder),
            codificar_entrada(notas, label_encoder),
            codificar_entrada(estilo, label_encoder),
            codificar_entrada(faixa_etaria, label_encoder)
        ]

        dados_entrada = pd.DataFrame([codificado], columns=[
            'Ocasião de Uso', 'Período de Uso', 'Clima', 
            'Sexo', 'Sentimento', 'Notas Olfativas', 
            'Estilo', 'Faixa Etária'
        ])

        previsao_intensidade = model.predict(dados_entrada)
        intensidade = intensidade_encoder.inverse_transform(previsao_intensidade)
        return intensidade[0]
    except Exception as e:
        print(f"Erro durante a previsão: {e}")
        raise

# Rota para receber dados de entrada e devolver a previsão
@app.route('/prever', methods=['POST'])
def prever():
    try:
        data = request.json
        ocasião = data.get('ocasião')
        periodo = data.get('periodo')
        clima = data.get('clima')
        sexo = data.get('sexo')
        sentimento = data.get('sentimento')
        notas = data.get('notas')
        estilo = data.get('estilo')
        faixa_etaria = data.get('faixa_etaria')

        # Chamar a função de previsão
        intensidade_prevista = prever_intensidade_nome_perfume(
            ocasião, periodo, clima, sexo, sentimento, notas, estilo, faixa_etaria
        )
        
        return jsonify({"intensidade": intensidade_prevista})
    except Exception as e:
        print(f"Erro na rota /prever: {e}")
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)