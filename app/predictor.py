from sklearn.ensemble import RandomForestClassifier
import numpy as np
# import sys
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
# from mpl_toolkits.mplot3d import Axes3D
from sklearn.preprocessing import StandardScaler

# from sklearn.datasets import load_digits
# from sklearn.feature_selection import SelectKBest, chi2
from sklearn import svm
from sklearn.neighbors import KNeighborsClassifier
import os


def pca(X, y, name, ncomponents):
    target_names = ["TEA", "CONTROL"]

    pca = PCA(n_components=ncomponents)
    X_r = pca.fit(X).transform(X)

    # Percentage of variance explained for each components
    print('explained variance ratio (first two components): %s'
          % str(pca.explained_variance_ratio_))

    # plt.figure()
    fig = plt.figure()

    colors = ['turquoise', 'darkorange']
    lw = 2
    if ncomponents == 3:
        ax = fig.add_subplot(111, projection='3d')
        for color, i, target_name in zip(colors, [1, 2], target_names):
            print(color, i, target_name)
            ax.scatter(X_r[y == i, 0], X_r[y == i, 1], X_r[y == i, 2],
                       color=color, alpha=.8, lw=lw, label=target_name)
    elif ncomponents == 2:
        for color, i, target_name in zip(colors, [1, 2], target_names):
            print(color, i, target_name)
            plt.scatter(X_r[y == i, 0], X_r[y == i, 1], color=color,
                        alpha=.8, lw=lw, label=target_name)

    plt.legend(loc='best', shadow=False, scatterpoints=1)
    plt.title('PCA of the dataset')
    plt.savefig(name)
    plt.close('all')
    # plt.show()
    return X_r


def load_data(fname):
    data = np.loadtxt(fname)

    nfeatures = data.shape[1] - 1
    print("Data shape: ", data.shape)
    print("nfeatures: ", nfeatures)

    X = data[:, :nfeatures]
    Y = data[:, nfeatures]
    print(X.shape, Y.shape)
    return X, Y

# Importancia de los atrubutos: ranking


def plot_features_rank(clf, X, Y, name):
    clf = clf.fit(X, Y)
    importances = clf.feature_importances_
    std = np.std([tree.feature_importances_ for tree in clf.estimators_],
                 axis=0)
    indices = np.argsort(importances)[::-1]

    # Print the feature ranking
    print("Feature ranking:")

    for f in range(X.shape[1]):
        print("%d. feature %d (%f)" %
              (f + 1, indices[f], importances[indices[f]]))

    # Plot the feature importances of the forest
    plt.figure()
    plt.title("Feature importances")
    plt.bar(range(X.shape[1]), importances[indices],
            color="r", yerr=std[indices], align="center")
    plt.xticks(range(X.shape[1]), indices)
    plt.xlim([-1, X.shape[1]])

    plt.savefig(name)


def decision_tree(X, Y, name):

    from sklearn import tree
    import graphviz

    clf = tree.DecisionTreeClassifier()
    clf = clf.fit(X, Y)

    dot_data = tree.export_graphviz(clf, out_file=None)
    graph = graphviz.Source(dot_data)
    graph.render(name)


#############################
#
#  Aqui empieza todo ...
#
#############################
def ejecutar_predictor(rutas):
    X, Y = load_data(rutas['csv'])
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    dir_trabajo = rutas['dir_trabajo']
    id_trabajo = rutas['id_trabajo']

    pca(X, Y, os.path.join(dir_trabajo, id_trabajo.lower()+".pca.png"),
        ncomponents=2)

    decision_tree(X, Y, os.path.join(dir_trabajo, id_trabajo.lower()+".tree"))

    clf = RandomForestClassifier(n_estimators=200)
    scores_rf = cross_val_score(clf, X, Y, cv=5)
    # print(scores)
    print("RF-Accuracy: %0.2f (+/- %0.2f)" %
          (scores_rf.mean(), scores_rf.std() * 2))

    # plot_features_rank(clf, X,Y,ruta_csv+".features.png")
    clf = svm.NuSVC(nu=0.1, gamma='scale')
    scores_svm = cross_val_score(clf, X, Y, cv=5)
    # print(scores)
    print("SVM-Accuracy: %0.2f (+/- %0.2f)" %
          (scores_svm.mean(), scores_svm.std() * 2))

    # plot_features_rank(clf, X,Y,ruta_csv+".features.png")
    clf = KNeighborsClassifier(n_neighbors=5)
    scores_knn = cross_val_score(clf, X, Y, cv=5)
    # print(scores)
    print("Knn-Accuracy: %0.2f (+/- %0.2f)" %
          (scores_knn.mean(), scores_knn.std() * 2))

    # plt.show()
