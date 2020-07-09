import pandas as pd
from flask import Flask
from flask import jsonify
from flask import request
import json
from flask import make_response

df = pd.read_csv("data.csv")
def avgRate(mname):
    return(float(df[df.Movie==mname].Average_Rating))

def posRev(mname):
    return(float(df[df.Movie==mname].Positive_Review))

def negRev(mname):
    return(float(df[df.Movie==mname].Negative_Review))

app = Flask(__name__)
@app.route('/movie', methods=['POST'])
def getReviewDetails():
    try:
        movie_name = request.json['mname']
        print(movie_name)
    except:
        return make_response(jsonify({'error' :'bad request'}),400)
    try:
        rating = avgRate(movie_name)
        pos=posRev(movie_name)
        neg=negRev(movie_name)
        
    except:
        return make_response(jsonify({'error' :'internal server error'}),500)
    
    return make_response(jsonify({"avgrate": rating,"pos":pos,"neg":neg}),200)

if __name__ == "__main__":
    app.run(host= 'https://limitless-forest-87695.herokuapp.com',port=5004,debug=True)
