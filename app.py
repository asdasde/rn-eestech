from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)

CORS(app)  # Enable CORS

model_path = '/home/lerceg/.cache/huggingface/hub/models--TheBloke--Llama-2-13B-chat-GGML/snapshots/3140827b4dfcb6b562cd87ee3d7f07109b014dd0/llama-2-13b-chat.ggmlv3.q5_1.bin'

prompt = (
"""Here are the sentences \n
The study material is very accessible. \n
"Cleanliness is not acceptable. \n
"Keyboards in classrooms are not working properly.\n
"Sometimes professor shows signs of anger issues.\n
"Library doesnt have all proper literature.\n
"Teaching assistants can be very helpful.\n
"Professor Stojakovic is the best.\n
          """)
prompt_template=f'''SYSTEM: You will need to classify student feedback for each sentence give the output in format (sentiment, topic). Sentiment can either be POSITIVE or NEGATIVE. Topic can be choosen as one from this list is either positive or negative and 'topic' which should be te subject of the feedback. It can be one of the following: ['professor, 'assistant', 'study material', 'infrastructure', 'course work'], if you cannot confidently classify the topic into one of those classify as 'other'. Please only return 

ASSISTANT:

USER: {prompt}
'''

lcpp_llm = None
lcpp_llm = Llama(
    model_path=model_path,
    n_threads=2, # CPU cores
    n_batch=512, # Should be between 1 and n_ctx, consider the amount of VRAM in your GPU.
    n_gpu_layers=32 # Change this value based on your model and your GPU VRAM pool.
    )

print('instancirao llm')


def prepare_output(raw : str) -> list:
    assistant_first = raw.find("ASSISTANT:")
    user_next = raw.find("USER:", assistant_first)
    user_next = user_next if user_next >= 0 else len(raw)
    system_next = raw.find("SYSTEM:", assistant_first)
    system_next = system_next if system_next >= 0 else len(raw)

    end = min(user_next, system_next)

    raw_cut = raw[assistant_first: end]

    responses = []
    for x in raw_cut.split("\n")[1:]:
        try:
            sentence = " ".join(x.strip().split(' - (')[0].split(' ')[1:]).strip() + "."
            sentiment, topic = x.strip().split(' - (')[1].split(',')
            sentiment = sentiment.strip().replace('(', '').replace(')', '')
            topic = topic.strip().replace('(', '').replace(')', '')
            dict = {'sentence': sentence, 'sentiment': sentiment, 'topic': topic}
            responses.append(dict)
        except Exception as e:
            pass
    return responses


@app.route('/generate', methods=['POST'])
def generate_response():
    # Parse the JSON input
    data = request.get_json()
    print(data)
    try:
        prompt_changing = f'Here is the feedback : {data["text"]}'
        prompt_template = f'''SYSTEM: You will need to classify student feedback for each sentence give the output in format (sentiment, topic). Sentiment can either be POSITIVE or NEGATIVE. Topic can be choosen as one from this list is either positive or negative and 'topic' which should be te subject of the feedback. It can be one of the following: ['professor, 'assistant', 'study material', 'infrastructure', 'course work'], if you cannot confidently classify the topic into one of those classify as 'other'. Please only return topics that i specified. Please for each sentecene, show output in format "n. sentence - (sentiment, topic)".  
        USER: {prompt_changing}
        ASSISTANT:
        '''
        response = lcpp_llm(prompt=prompt_template, max_tokens=256, temperature=0.5, top_p=0.95,
                            repeat_penalty=1.2, top_k=2,
                            echo=True)
        response_text = response["choices"][0]['text']

        print(response_text)
        try:
            response_list = prepare_output(response_text)
            print(response_list)
            return jsonify({'response': response_list}), 200
        except Exception as e:
            print(response_text)
            return jsonify({'response': response_text}), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
