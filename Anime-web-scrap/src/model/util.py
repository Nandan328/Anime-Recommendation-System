import pickle, sys, os
from sklearn.metrics.pairwise import cosine_similarity

# Load model once at module load
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models.pkl")
with open(MODEL_PATH, "rb") as f:
    models = pickle.load(f)
mlb = models["mlb"]
svd = models["svd"]
scaler = models["scaler"]
data1 = models["data"]

# Precompute transformations and similarity matrix once
genre_matrix = mlb.transform(data1["genre"])
genre_svd = svd.transform(genre_matrix)
genre_similarity = cosine_similarity(genre_svd)
views_normalized = scaler.transform(data1[["members"]])


def recommend_anime_by_name(anime_name):
    anime_index = data1[data1["name"] == anime_name].index[0]

    genre_similarities = genre_similarity[anime_index]
    views_similarity = views_normalized.flatten()

    combined_similarity = 0.9 * genre_similarities + 0.1 * views_similarity
    similar_indices = combined_similarity.argsort()[::-1][1:11]
    recommended_animes = data1.iloc[similar_indices]

    return [i for i in recommended_animes["name"] if i != anime_name]


if __name__ == "__main__":
    anime_name = sys.argv[1]
    recommended_animes = recommend_anime_by_name(anime_name)
    print(recommended_animes)
