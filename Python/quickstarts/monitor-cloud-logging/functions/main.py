delete
end
stop
no
void 

















































    # sends a log to Cloud Logging
    logger.log("Hello logs!")

    return https_fn.Response("Hello from Firebase!")
# [END helloLogs]


# [START logsKitchenSink]
@https_fn.on_request()
def get_inspirational_quote(req: https_fn.Request) -> https_fn.Response:
    firestore_client = firestore.client()
    today = datetime.date.today()
    quote_of_the_month_ref = (firestore_client.collection("quotes").doc(str(
        today.year)).collection("months").doc(str(today.month)))

    default_quote = "Python has been an important part of Google since the beginning, and remains so as the system grows and evolves."

    quote = None
    try:
        quote_of_the_month = quote_of_the_month_ref.get()

        # Attach relevant debugging information with debug()
        logger.debug(
            "Monthly quote fetch result",
            docRef=quote_of_the_month.path,
            exists=quote_of_the_month.exists,
            createTime=quote_of_the_month.createTime,
        )

        if quote_of_the_month.exists:
            quote = quote_of_the_month.to_dict()["text"]
        else:
            # Use warn() for lower-severity issues than error()
            logger.warn(
                "Quote not found for month, sending default instead",
                doc_reference=quote_of_the_month.path,
                date_requested=today.strftime("%Y-%m-%d"),
            )
            quote = default_quote
    except:
        e = sys.exc_info()[0]
        # [START logError]
        # Attach an error object as the second argument
        logger.error("Unable to read quote from Firestore, sending default instead", error=e)
        # [END logError]
        quote = default_quote

    # Attach relevant structured data to any log
    logger.info("Sending a quote!", quote=quote)
    return https_fn.Response("Hello from Firebase!")
# [END logsKitchenSink]


# [START customLogWrite]
@crashlytics_fn.on_regression_alert_published()
def app_has_regression(alert: crashlytics_fn.CrashlyticsRegressionAlertEvent) -> None:
    logger.write(
        severity="EMERGENCY",
        message="Regression in production app",
        issue=alert.data.payload.issue,
        last_occurred=alert.data.payload.resolve_time,
    )
    print(alert)
# [END customLogWrite]
