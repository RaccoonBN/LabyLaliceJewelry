from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import json # Thêm thư viện json

# Helper function to fetch data from the backend API
def fetch_data_from_api(endpoint: str, params: Dict = None) -> Any:
    """Fetches data from the backend API."""
    try:
        response = requests.get(endpoint, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None

class ActionCheckOrderStatus(Action):
    def name(self) -> Text:
        return "action_check_order_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        order_id = tracker.slots.get("order_id")
        if not order_id:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp mã đơn hàng.")
            return []

        # Call the /orders/:orderId endpoint
        endpoint = f"http://localhost:2000/orders/{order_id}"
        order_data = fetch_data_from_api(endpoint)

        if order_data:
            status = order_data.get("status")
            if status:
                dispatcher.utter_message(text=f"Đơn hàng {order_id} của bạn đang có trạng thái: {status}")
                return []
            else:
                dispatcher.utter_message(text="Không tìm thấy thông tin đơn hàng.")
                return []
        else:
            dispatcher.utter_message(text="Có lỗi xảy ra khi truy vấn thông tin đơn hàng.")
            return []

class ActionSuggestProducts(Action):
    def name(self) -> Text:
        return "action_suggest_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        category_name = tracker.slots.get("category_name")
        if not category_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp danh mục sản phẩm.")
            return []

        try:
            # Gọi API để lấy danh mục
            categories_endpoint = "http://localhost:2000/categories"
            categories = fetch_data_from_api(categories_endpoint)

            if not categories:
                dispatcher.utter_message(text="Không thể lấy danh mục sản phẩm từ server.")
                return []

            category_mapping = {cat["name"].lower(): cat["id"] for cat in categories}
            category_id = category_mapping.get(category_name.lower())

            if not category_id:
                dispatcher.utter_message(text="Danh mục sản phẩm không hợp lệ.")
                return []

            # Gọi API để lấy sản phẩm theo danh mục
            products_endpoint = "http://localhost:2000/products"
            products = fetch_data_from_api(products_endpoint, params={"collection_id": category_id})

            if products:
                top_products = products[:3]  # Chỉ lấy 3 sản phẩm đầu tiên
                dispatcher.utter_message(text=f"Đây là một vài sản phẩm {category_name} mà bạn có thể thích:")

                product_list = []
                for product in top_products:
                    image_url = f"http://localhost:4000/uploads/{product['image']}" if product.get("image") else "/default-image.jpg"
                    product_list.append({
                        "name": product['name'],
                        "price": product['price'],
                        "image": image_url,
                        "id": product['id']
                    })

                dispatcher.utter_message(json_message={"products": product_list})


            else:
                dispatcher.utter_message(text="Không tìm thấy sản phẩm nào trong danh mục này.")

        except Exception as e:
            print(f"Lỗi trong ActionSuggestProducts: {e}")
            dispatcher.utter_message(text="Có lỗi xảy ra khi truy vấn sản phẩm. Vui lòng thử lại sau.")

        return []

class ActionTopRatedProducts(Action):
    def name(self) -> Text:
        return "action_top_rated_products"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Gọi API lấy sản phẩm được đánh giá cao
        endpoint = "http://localhost:2000/products/top-rated"
        products = fetch_data_from_api(endpoint)

        if products and len(products) > 0:
            top_products = products[:3]  # Lấy 3 sản phẩm đầu tiên
            
            product_list = []
            for product in top_products:
                image_url = f"http://localhost:4000/uploads/{product['image']}" if product.get("image") else "/default-image.jpg"
                product_list.append({
                    "name": product['name'],
                    "price": product['price'],
                    "image": image_url,
                    "id": product['id']
                })

            dispatcher.utter_message(text="Đây là một vài sản phẩm được đánh giá cao:")
            dispatcher.utter_message(json_message={"products": product_list})


        else:
            dispatcher.utter_message(text="❌ Không tìm thấy sản phẩm nào được đánh giá cao.")

        return []


class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Xin lỗi, tôi không hiểu. Bạn có thể thử lại được không?")

        return []