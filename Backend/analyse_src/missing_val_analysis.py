import pandas as pd
from abc import ABC,abstractmethod
import matplotlib.pyplot as plt
import seaborn as sns
import logging
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class MissingValueAnalysis(ABC):
    @abstractmethod
    def analyze(self,df:pd.DataFrame)->None:
        pass
class MissingValueVisualizer(MissingValueAnalysis):
    def analyze(self,df:pd.DataFrame)->None:
        missing_data = df.isnull().sum()
        missing_data = missing_data[missing_data > 0].sort_values(ascending=False)
        if missing_data.empty:
            logging.info("No missing values found in the dataset.")
            return
        plt.figure(figsize=(10, 6))
        sns.barplot(x=missing_data.index, y=missing_data.values, palette="viridis")
        plt.xticks(rotation=90)
        plt.ylabel('Number of Missing Values')
        plt.title('Missing Values per Column')
        plt.show()
        logging.info("Missing value analysis completed and visualized.")
class MissingValueReporter(MissingValueAnalysis):
    def analyze(self,df:pd.DataFrame)->None:
        missing_data = df.isnull().sum()
        missing_data = missing_data[missing_data > 0].sort_values(ascending=False)
        if missing_data.empty:
            logging.info("No missing values found in the dataset.")
            return
        report = pd.DataFrame({'Column': missing_data.index, 'Missing Values': missing_data.values})
        report['Percentage'] = (report['Missing Values'] / len(df)) * 100
        logging.info("Missing Value Report:\n" + report.to_string(index=False))
        logging.info("Missing value analysis completed and reported.")
class MissingValueAnalysisFactory:
    def get_analyzer(self,analysis_type:str)->MissingValueAnalysis:
        if analysis_type=="visualize":
            return MissingValueVisualizer()
        elif analysis_type=="report":
            return MissingValueReporter()
        else:
            logging.error("Invalid analysis type. Choose 'visualize' or 'report'.")
            raise ValueError("Invalid analysis type. Choose 'visualize' or 'report'.")