
TEST_DIR := ./test
TESTS := $(wildcard $(TEST_DIR)/test_*.js)

make: quips
quips:
	qjsc -o $@ ./src/main.js

.PHONY: test $(TESTS) clean
test: $(TESTS)

$(TESTS):
	qjs $@

clean:
	rm -f quips

