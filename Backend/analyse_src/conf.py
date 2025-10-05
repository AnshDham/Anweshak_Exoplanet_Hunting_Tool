import pandas as pd
from abc import ABC,abstractmethod
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix,classification_report

import logging
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class ConfussionMatrixVisualizer(ABC):
    @abstractmethod
    def plot(self,y_true:pd.Series,y_pred:pd.Series,labels:list)->None:
        pass
class ConfusionMatrixPlotter(ConfussionMatrixVisualizer):
    def plot(self,y_true:pd.Series,y_pred:pd.Series,labels:list)->None:
        from sklearn.metrics import confusion_matrix
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.title('Confusion Matrix')
        plt.show()
        logging.info("Confusion matrix plotted successfully.")
class ClassificationReportVisualizer(ConfussionMatrixVisualizer):
    def plot(self,y_true:pd.Series,y_pred:pd.Series)->None:
        from sklearn.metrics import classification_report
        report = classification_report(y_true, y_pred)
        print("Classification Report:\n", report)
        logging.info("Classification report generated successfully.")
        
class ConfusionAndReportVisualizer:
    @staticmethod
    def get_confusion_matrix_visualizer()->ConfussionMatrixVisualizer:
        return ConfusionMatrixPlotter()
    @staticmethod
    def get_classification_report_visualizer()->ConfussionMatrixVisualizer:
        return ClassificationReportVisualizer()