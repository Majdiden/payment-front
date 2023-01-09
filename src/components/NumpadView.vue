<template>
  <v-app>
    <v-card height="96vh" class="ma-3 pa-3">
      <v-card-title class=""> NFC Payment </v-card-title>
      <v-form ref="form">
        <v-currency-field
          label="Amount"
          suffix="SDG"
          filled
          :rules="[(v) => !!v || 'Amount is required']"
          type="number"
          v-model="amount"
        />
      </v-form>
      <v-row>
        <v-col
          cols="4"
          v-for="digit in digits"
          :key="digit"
          class="text-center"
        >
          <v-btn class="display-4" color="primary" @click="enterDigit(digit)">{{
            digit
          }}</v-btn>
        </v-col>
        <v-col cols="8" class="text-center">
          <v-btn
            width="200"
            class="display-4"
            color="primary"
            @click="clearAmount"
            >C</v-btn
          >
        </v-col>
      </v-row>
      <v-dialog v-model="showPinInput" max-width="290">
        <v-card>
          <v-overlay v-if="loading && !success" color="white" opacity="0.5">
            <v-progress-circular indeterminate color="primary" />
          </v-overlay>
          <v-layout justify-center align-center>
            <v-flex xs4>
              <v-card-text v-if="success">
                <v-icon color="green" size="50">mdi-check</v-icon>
                <!-- <p>Payment Successful</p> -->
              </v-card-text>
            </v-flex>
            <v-flex xs6>
              <v-card-text class="pt-8" v-if="success">
                <!-- <v-icon color="green" size="50">mdi-check</v-icon> -->
                <p class="font-weight-bold">Payment Successful</p>
                <v-btn
                  color="grey darken-1"
                  text
                  @click="
                    showPinInput = false;
                    success = false;
                  "
                  >Close</v-btn
                >
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-card-title v-if="!loading && !success" class="headline"
            >Enter PIN</v-card-title
          >
          <v-card-text v-if="!loading && !success">
            <v-text-field
              v-model="pin"
              type="password"
              :rules="[(v) => v.length === 4 || 'PIN must be 4 digits']"
            />
          </v-card-text>
          <v-card-actions v-if="!loading && !success">
            <v-btn color="green darken-1" text @click="processPayment()"
              >Pay</v-btn
            >
            <v-btn color="grey darken-1" text @click="showPinInput = false"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showTapCard" max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            class="mt-12"
            width="325"
            v-on="on"
            :disabled="!amount"
            @click="scanCard()"
          >
            Process Payment
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Tap your card</v-card-title>
          <v-card-text>
            <h4>You are paying : SDG {{ amount }}</h4>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey darken-1" text @click="showTapCard = false"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      digits: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      amount: "",
      pin: "",
      showPinInput: false,
      showTapCard: false,
      loading: false,
      success: false,
      card: "",
    };
  },
  methods: {
    enterDigit(digit) {
      this.amount += digit.toString();
    },
    async scanCard() {
      axios
        .get("http://localhost:8082/api/scan-to-pay")
        .then((response) => {
          if (response.data.message == "success") {
            this.showTapCard = false;
            this.showPinInput = true;
            this.card = response.data.card;
          }
        })
        .catch((err) => console.log(err));
    },
    async processPayment() {
      this.loading = !this.loading;
      // Send the payment request to the backend
      await axios
        .post("http://localhost:8082/api/pay", {
          amount: this.amount.toString(),
          card: this.card,
        })
        .then(async (response) => {
          if ((await response.data.message) == "SUCCESSFUL") {
            setTimeout(() => {
              this.loading = !this.loading;
              this.success = !this.success;
            }, 2000);
          }
        })
        .catch((err) => console.log(err));
      // Clear the pin and close the modal
      this.pin = "";
      this.amount = "";
      // this.showPinInput = false;
    },
    clearAmount() {
      this.amount = "";
    },
    enterDecimalPoint() {
      if (!this.amount.includes(".")) {
        this.amount = `${this.amount}.0`;
      }
    },
  },
};
</script>
<style scoped>
.display-4 {
  font-size: 1rem !important;
}
</style>
