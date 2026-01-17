# Ticket System
Projekt zaliczeniowy z przedmiotu Projektowanie Aplikacji Rozproszonych. Jest to system rozproszony składający się z serwera oraz dwóch różnych klientów

## Architektura i Technologie
Projekt wykorzystuje Docker i składa się z trzech głównych modułów:
1. **Backend**
   - **Technologie:** Node.js, TypeScript, Express, ws.
   - **Rola:** Udostępnia dwa interfejsy: REST API(CRUD) oraz WebSocket Server.
   - **Bezpieczeństwo:** Metody POST, PATCH są zabezpieczone przez X-API-KEY

2. **Klient Web**
   - **Technologie:** React, Vite, Chakra UI, Nginx.
   - **Rola:** Interfejs do podglądu zgłoszeń. Pobiera historię przez REST przy starcie, a następnie nasłuchuje zdarzeń przez WebSockets, aby aktualizować widok bez odświeżania strony.

3. **Klient  Admin CLI**
   - **Technologie:** Node.js, Axios, Commander.
   - **Rola:** CLI dla administratora. Służy do tworzenia nowych zgłoszeń i zmiany ich statusów poprzez HTTP request.

W projekcie zastosowano świadomie hybrydowy model:

1. **REST Sync:** Klient CLI wysyła żądanie HTTP POST/PATCH do serwera. Serwer przetwarza dane, zapisuje je w pamięci i zwraca odpowiedź 201 Created.
2. **WebSockets Async:** Po pomyślnej operacji REST, serwer natychmiast rozgłasza zdarzenie do wszystkich podłączonych klientów Web.
## Uruchomienie projektu
Wymagany jest zainstalowany Docker oraz Docker Compose.
1. **Start kontenerów:**
   W terminalu, w głównym katalogu projektu:
   ```bash
   docker-compose up --build