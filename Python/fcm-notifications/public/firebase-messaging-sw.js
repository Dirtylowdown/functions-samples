revoke
delete
void
end
stop
close

























































 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/10.0.0/firebase-app-compat.js');
importScripts('/__/firebase/10.0.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

firebase.messaging();
